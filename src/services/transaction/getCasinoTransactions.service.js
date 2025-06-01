import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { CASINO_TRANSACTION_STATUS } from '@src/utils/constants/casinoManagement.constants'
import { LEDGER_PURPOSE, LEDGER_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tagId: { type: 'string' },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    userId: { type: 'string' },
    gameId: { type: 'string' },
    walletId: { type: 'string' },
    transactionId: { type: 'string' },
    searchString: { type: 'string' },
    currencyId: { type: 'string' },
    gameName: { type: 'string' },
    conversionRate: { type: 'number' },
    previousTransactionId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    status: { enum: Object.values(CASINO_TRANSACTION_STATUS) },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'transactionId', 'userId', 'walletId', 'gameId', 'ledgerId', 'status', 'conversionRate', 'previousTransactionId', 'createdAt'], default: 'createdAt' },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    tagIds: { type: 'string' },
    type: { enum: Object.values(LEDGER_TYPES) },
    csvDownload: { type: 'boolean', default: false }
  }
})

export class GetCasinoTransactionsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dateOptions, page, status, userId, gameId, perPage, walletId,
      transactionId, previousTransactionId, currencyId, purpose, searchString,
      gameName, tagIds, type, csvDownload
    } = this.args

    try {
      const { fromDate, toDate } = getReportDates(
        dateOptions,
        this.args.fromDate || serverDayjs().startOf('month'),
        this.args.toDate || serverDayjs().endOf('day')
      )

      // Query to count total transactions
      const countQuery = `
         SELECT
         COUNT(DISTINCT ct.id) AS totalcount
         FROM
         public.casino_transactions AS ct
         INNER JOIN
         public.ledgers AS l ON ct.id = l.transaction_id
         INNER JOIN
         public.users AS u ON u.id = ct.user_id
         INNER JOIN
          casino_games as cg ON ct.game_id = cg.id
         ${tagIds
? `INNER JOIN
         user_tags AS ut ON ct.user_id = ut.user_id`
 : ''}
         WHERE
         ct.created_at BETWEEN :fromDate AND :toDate
         AND l.transaction_type != 'standard'
         ${userId ? 'AND ct.user_id = :userId' : ''}
         ${purpose ? 'AND l.purpose = :purpose' : ''}
         ${searchString ? `AND (u.email ILIKE '%${searchString}%' OR u.username LIKE '%${searchString}%')` : ''}
         ${type === LEDGER_TYPES.DEBIT ? 'AND l.to_wallet_id IS NOT NULL AND l.from_wallet_id IS NULL' : ''}
         ${type === LEDGER_TYPES.CREDIT ? 'AND l.to_wallet_id IS NULL AND l.from_wallet_id IS NOT NULL' : ''}
         ${transactionId ? 'AND l.transaction_id = :transactionId' : ''}
         ${gameName
? `AND EXISTS (
          SELECT 1
          FROM jsonb_each_text(cg.name) AS jsonb_entry(key, value)
          WHERE value ILIKE '%${gameName}%')`
: ''}
        ${status ? 'AND ct.status = :status' : ''}
        ${currencyId ? 'AND l.currency_id = :currencyId' : ''}
        ${tagIds ? 'AND ut.tag_id = :tagIds' : ''}
      `

      // Ledger details aggregation query
      const ledgerQuery = `
        WITH aggregated_ledger AS (
          SELECT
          l.transaction_id AS transaction_id,
          l.purpose,
          l.created_at,
          l.to_wallet_id,
          l.from_wallet_id,
          l.currency_id,
          SUM(l.amount) FILTER (WHERE cu.code = 'GC') AS GCAmount,
          SUM(l.amount) FILTER (WHERE cu.code = 'PSC') AS PSCAmount,
          SUM(l.amount) FILTER (WHERE cu.code = 'BSC') AS BSCAmount,
          SUM(l.amount) FILTER (WHERE cu.code = 'RSC') AS RSCAmount,
          CASE
          WHEN l.to_wallet_id IS NOT NULL AND l.from_wallet_id IS NULL THEN 'debit'
          WHEN l.to_wallet_id IS NULL AND l.from_wallet_id IS NOT NULL THEN 'credit'
          ELSE NULL
          END AS type
          FROM
          ledgers AS l
          INNER JOIN
          currencies AS cu ON l.currency_id = cu.id
          WHERE
          l.transaction_type != 'standard'
          ${currencyId ? 'AND cu.id = :currencyId' : ''}
          GROUP BY
          l.transaction_id, l.purpose, l.created_at, l.to_wallet_id, l.from_wallet_id,
          l.currency_id
        )
        SELECT
        ct.user_id AS "userId",
        u.username AS username,
        ct.id AS "transactionId",
        ct.created_at AS "createdAt",
        ct.status AS status,
        json_agg(
        json_build_object(
            'purpose', al.purpose,
            'date', al.created_at,
            'GCAmount', al.GCAmount,
            'PSCAmount', al.PSCAmount,
            'BSCAmount', al.BSCAmount,
            'RSCAmount', al.RSCAmount,
            'type', al.type,
            'toWalletId', al.to_wallet_id,
            'fromWalletId', al.from_wallet_id,
            'currencyId', al.currency_id
           )
       ) AS "ledgerDetail",
      json_agg(
       json_build_object(
            'id', cg.id,
            'name', cg.name
           )) AS "casinoGame",
      json_agg(
       json_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email
           )) AS user
        ${tagIds
          ? `, json_build_object(
        'id', ut.id,
        'tagId', ut.tag_id,
        'userId', ut.user_id
        ) AS "userTag"`
 : ''}
       FROM
       casino_transactions AS ct
       INNER JOIN
       aggregated_ledger AS al ON ct.id = al.transaction_id
       INNER JOIN
       users AS u ON ct.user_id = u.id
      INNER JOIN
      casino_games as cg ON ct.game_id = cg.id
      ${tagIds
? `INNER JOIN
        user_tags AS ut ON ct.user_id = ut.user_id`
 : ''}
       WHERE
       ct.created_at BETWEEN :fromDate AND :toDate
       ${userId ? 'AND ct.user_id = :userId' : ''}
       ${purpose ? 'AND al.purpose = :purpose' : ''}
      ${searchString ? `AND (u.email ILIKE '%${searchString}%' OR u.username LIKE '%${searchString}%')` : ''}
      ${type === LEDGER_TYPES.DEBIT ? 'AND al.to_wallet_id IS NOT NULL AND al.from_wallet_id IS NULL' : ''}
      ${type === LEDGER_TYPES.CREDIT ? 'AND al.to_wallet_id IS NULL AND al.from_wallet_id IS NOT NULL' : ''}
       ${transactionId ? 'AND al.transaction_id = :transactionId AND al.transaction_id IS NOT NULL' : ''}
       ${gameName
? `AND EXISTS (
        SELECT 1
        FROM jsonb_each_text(cg.name) AS jsonb_entry(key, value)
        WHERE value ILIKE '%${gameName}%' )`
 : ''}
       ${status ? 'AND ct.status = :status AND ct.status IS NOT NULL' : ''}
       ${tagIds ? 'AND ut.tag_id = :tagIds' : ''}
       GROUP BY
       ct.id, ct.user_id, u.username, ct.status ${tagIds ? ', ut.id' : ''}
       ORDER BY
       ct.created_at DESC
       ${!csvDownload ? 'LIMIT :limit OFFSET :offset' : ''};`

      // Fetch casino transactions and aggregated ledger details
      const casinoTransactions = await this.context.sequelize.query(ledgerQuery, {
        replacements: {
          fromDate,
          toDate,
          userId,
          purpose,
          searchString,
          transactionId,
          gameName,
          status,
          currencyId,
          tagIds,
          limit: perPage,
          offset: (page - 1) * perPage
        },
        type: this.context.sequelize.QueryTypes.SELECT
      })

      // Fetch total amounts for bet and win
      const totalAmountResult = await this.context.sequelize.query(`
        SELECT
          SUM(CASE WHEN purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN amount ELSE 0 END) AS "totalBetAmount",
          SUM(CASE WHEN purpose IN ('${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}') THEN amount ELSE 0 END) AS "totalWinAmount"
        FROM
          ledgers
        INNER JOIN
        casino_transactions AS ct ON ledgers.transaction_id = ct.id
        WHERE
          purpose IN ('${LEDGER_PURPOSE.CASINO_BET}', '${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}')
          AND ledgers.created_at BETWEEN :fromDate AND :toDate
          ${userId ? `AND ct.user_id = ${userId}` : ''}
      `, {
        replacements: { fromDate, toDate },
        type: this.context.sequelize.QueryTypes.SELECT
      })

      // Fetch total transaction count
      const totalCountResult = await this.context.sequelize.query(countQuery, {
        replacements: { fromDate, toDate, userId, purpose, searchString, transactionId, gameName, status, currencyId, tagIds },
        type: this.context.sequelize.QueryTypes.SELECT
      })

      const totalCount = Number(totalCountResult[0]?.totalcount)

      return {
        ...totalAmountResult[0],
        casinoTransactions,
        page,
        perPage,
        totalPages: Math.ceil(totalCount / perPage),
        totalCount
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
