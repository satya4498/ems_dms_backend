import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE, LEDGER_TYPES, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tagId: { type: 'string' },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    searchString: { type: 'string' },
    currencyId: { type: 'string' },
    userId: { type: 'string' },
    actioneeId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    status: { enum: Object.values(TRANSACTION_STATUS) },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    type: { enum: Object.values(LEDGER_TYPES) },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'toWalletId', 'fromWalletIds', 'ledgerId', 'status', 'actioneeId', 'createdAt'], default: 'createdAt' },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    tagIds: { type: 'string' },
    csvDownload: { type: 'boolean', default: false }
  }
})

export class GetBankingTransactionsCsvReportService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, status, userId, perPage, searchString, purpose, currencyId, dateOptions, tagIds, orderBy, order, csvDownload } = this.args

    try {
      // Construct date range and where conditions
      const { fromDate, toDate } = getReportDates(dateOptions, this.args.fromDate || serverDayjs().startOf('month'), this.args.toDate || serverDayjs().endOf('day'))
      let whereClause = 'WHERE ct.created_at BETWEEN :fromDate AND :toDate'
      if (userId) whereClause += ' AND ct.user_id = :userId'
      if (status) whereClause += ' AND ct.status = :status'
      if (purpose) whereClause += ' AND al.purpose = :purpose'
      if (searchString) whereClause += ' AND (u.email LIKE :search OR u.username LIKE :search)'
      if (tagIds) whereClause += ' AND ut.tag_id IN (:tagIds)'
      // if (currencyId) whereClause += ' AND al.currency_id = :currencyId'
      // Raw query to fetch total amounts and count after join
      const countQuery = `
         SELECT
         COUNT(DISTINCT t.id) AS totalcount
         FROM
         public.transactions AS t
         INNER JOIN
         public.ledgers AS l ON t.id = l.transaction_id
         INNER JOIN
         public.users AS u ON u.id = t.user_id
         WHERE
         t.created_at BETWEEN :fromDate AND :toDate
         AND l.transaction_type != 'casino'
         ${userId ? 'AND t.user_id = :userId' : ''}
         ${purpose ? 'AND l.purpose = :purpose' : ''}
         ${searchString ? 'AND (u.email LIKE :search OR u.username LIKE :search)' : ''}
          `

      const ledgersQuery = `
         WITH aggregated_ledger AS (
        SELECT
        l.transaction_id AS transaction_id,
        l.purpose as purpose,
        CASE WHEN SUM(l.amount) FILTER (WHERE cu.code = 'GC') > 0 THEN SUM(l.amount) FILTER (WHERE cu.code = 'GC') ELSE 0 END AS GCAmount,
        CASE WHEN SUM(l.amount) FILTER (WHERE cu.code = 'PSC') > 0 THEN SUM(l.amount) FILTER (WHERE cu.code = 'PSC') ELSE 0 END AS PSCAmount,
        CASE WHEN SUM(l.amount) FILTER (WHERE cu.code = 'BSC') > 0 THEN SUM(l.amount) FILTER (WHERE cu.code = 'BSC') ELSE 0 END AS BSCAmount,
        CASE WHEN SUM(l.amount) FILTER (WHERE cu.code = 'RSC') > 0 THEN SUM(l.amount) FILTER (WHERE cu.code = 'RSC') ELSE 0 END AS RSCAmount
        FROM
        ledgers AS l
        INNER JOIN
        currencies AS cu ON l.currency_id = cu.id
        WHERE l.transaction_type != 'casino'
        ${currencyId ? ' AND l.currency_id = :currencyId' : ''}
        GROUP BY
        l.transaction_id, l.purpose
        )
        SELECT
        ct.user_id AS "USER ID",
        u.username AS "USERNAME",
        ct.id AS "TRANSACTION ID",
        TO_CHAR(ct.created_at, 'YYYY-MM-DD HH24:MI:SS') AS "DATE",
        ct.status AS "STATUS",
        al.purpose as "PURPOSE",
        al.GCAmount AS "GC COIN",
        al.PSCAmount AS "PSC COIN",
        al.BSCAmount AS "BSC COIN",
        al.RSCAmount AS "RSC COIN"
       FROM
       transactions AS ct
       INNER JOIN
       aggregated_ledger AS al ON ct.id = al.transaction_id
       INNER JOIN
       users AS u ON ct.user_id = u.id
       ${tagIds
         ? `INNER JOIN
       user_tags as ut ON u.id = ut.user_id`
         : ''}
       ${whereClause}
      GROUP BY
      ct.id, ct.user_id, u.username, ct.status, al.purpose, al.GCAmount, al.PSCAmount, al.BSCAmount, al.RSCAmount
      ORDER BY
      ct.created_at DESC
      ${!csvDownload ? 'LIMIT :limit OFFSET :offset' : ''};`

      const amountSummaryQuery = `
         SELECT
         SUM(l.amount) FILTER (WHERE l.purpose = 'Purchase') AS total_purchase_amount,
         SUM(l.amount) FILTER (WHERE l.purpose != 'Purchase') AS total_redeem_amount
         FROM
         public.transactions AS t
         INNER JOIN
         public.ledgers AS l ON t.id = l.transaction_id
         INNER JOIN
         public.currencies AS cu ON cu.id = l.currency_id
         WHERE l.transaction_type != 'casino'
`

      const replacements = {
        fromDate,
        toDate,
        currencyId,
        userId,
        purpose,
        status,
        tagIds,
        search: `%${searchString}%`,
        limit: perPage,
        offset: (page - 1) * perPage
      }
      // Execute the queries concurrently
      const [summaryResult, ledgers, summaryAmount] = await Promise.all([
        this.context.sequelize.query(countQuery, { replacements, type: this.context.sequelize.QueryTypes.SELECT }),
        this.context.sequelize.query(ledgersQuery, { replacements, type: this.context.sequelize.QueryTypes.SELECT, raw: true }),
        this.context.sequelize.query(amountSummaryQuery, { replacements, type: this.context.sequelize.QueryTypes.SELECT })
      ])

      // Ensure that we correctly extract the total counts and amounts
      const { totalcount } = summaryResult[0]
      const totalPurchaseAmount = summaryAmount[0]?.total_purchase_amount || 0
      const totalRedeemAmount = summaryAmount[0]?.total_redeem_amount || 0

      return {
        totalPurchaseAmount,
        totalRedeemAmount,
        transactions: ledgers,
        page,
        totalPages: Math.ceil(totalcount / perPage)
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
