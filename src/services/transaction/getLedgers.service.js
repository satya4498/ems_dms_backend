import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE, LEDGER_TYPES } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    type: { enum: Object.values(LEDGER_TYPES) },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    userId: { type: 'string' },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    page: { type: 'number', minimum: 1, default: 1 },
    searchString: { type: 'string' },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'userId', 'amount', 'type', 'purpose', 'createdAt'], default: 'createdAt' },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM }
  }
})

export class GetLedgersService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const {
      page,
      perPage,
      purpose,
      dateOptions,
      fromDate: customFromDate,
      toDate: customToDate,
      order,
      orderBy,
      userId,
      searchString
    } = this.args

    try {
      const where = {}
      if (purpose) where.purpose = purpose

      const { fromDate, toDate } = getReportDates(dateOptions, customFromDate || serverDayjs().startOf('month'), customToDate || serverDayjs().endOf('day'))
      where.createdAt = { [Op.and]: [{ [Op.gte]: fromDate }, { [Op.lte]: toDate }] }

      const conditions = []

      if (searchString) {
        conditions.push(
          { '$fromWallet.user.username$': { [Op.like]: `%${searchString}%` } },
          { '$fromWallet.user.email$': { [Op.like]: `%${searchString}%` } },
          { '$toWallet.user.username$': { [Op.like]: `%${searchString}%` } },
          { '$toWallet.user.email$': { [Op.like]: `%${searchString}%` } }
        )
      }

      if (userId) {
        conditions.push(
          { '$fromWallet.user.id$': userId },
          { '$toWallet.user.id$': userId }
        )
      }

      const ledgers = await this.context.sequelize.models.ledger.findAndCountAll({
        attributes: { exclude: ['updatedAt'] },
        where: {
          ...where,
          ...(conditions.length ? { [Op.or]: conditions } : {})
        },
        include: [
          {
            as: 'fromWallet',
            attributes: ['id'],
            model: this.context.sequelize.models.wallet,
            include: {
              attributes: ['username', 'email', 'id'],
              model: this.context.sequelize.models.user
            }
          },
          {
            as: 'toWallet',
            attributes: ['id'],
            model: this.context.sequelize.models.wallet,
            include: {
              attributes: ['username', 'email', 'id'],
              model: this.context.sequelize.models.user
            }
          }
        ],
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[orderBy, order]]
      })

      return {
        ledgers: ledgers.rows,
        page,
        totalPages: Math.ceil(ledgers.count / perPage)
      }

    } catch (error) {
      throw new APIError(error.message || 'An error occurred while fetching ledgers.')
    }
  }
}
