import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SWEEPS_COINS, LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  }
})

export class GetReferralTransactionsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const searchString = this.args.searchString

    try {
      const where = `l.purpose = '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}' ${searchString ? 'and (u.email LIKE :searchString OR u.username LIKE :searchString OR u.first_name LIKE :searchString OR u.last_name LIKE :searchString' : ''}`
      const queryObject = `
      SELECT u.id , u.username, u.email, u.first_name , u.last_name , t.status, COUNT(distinct(t.id)) AS referral_count,
      SUM(l.amount) FILTER (WHERE cu.code = '${SWEEPS_COINS.GC}') AS GCAmount,
      SUM(l.amount) FILTER (WHERE cu.code = '${SWEEPS_COINS.BSC}') AS BSCAmount
      FROM users u
      JOIN transactions as t ON u.id = t.user_id
      JOIN ledgers as l ON l.transaction_id = t.id
      INNER JOIN currencies AS cu
      ON l.currency_id = cu.id
      WHERE ${where}
      GROUP BY u.id, u.username, u.email, t.status
      LIMIT ${perPage}
      OFFSET ${(page - 1) * perPage}`

      const referralTransaction = await this.context.sequelize.query(queryObject, { type: this.context.sequelize.QueryTypes.SELECT })

      return { referralTransaction, page, totalPages: Math.ceil(referralTransaction.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
