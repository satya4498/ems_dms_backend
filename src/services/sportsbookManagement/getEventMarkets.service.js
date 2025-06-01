import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { EVENT_MARKET_STATUS } from '@src/utils/constants/sportbookManagement.constants.js'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    eventId: { type: 'string' },
    searchString: { type: 'string' },
    status: { enum: Object.values(EVENT_MARKET_STATUS) },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'providerId', 'name'], default: 'id' }
  },
  required: ['eventId']
})

export class GetEventMarketsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const eventId = this.args.eventId
    const status = this.args.status
    const searchString = this.args.searchString

    try {
      const where = { eventId }
      const marketFilter = {}

      if (status) where.status = status
      if (searchString) marketFilter.name = { [Op.iLike]: `%${searchString}%` }

      const eventMarkets = await this.context.sequelize.models.eventMarket.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        include: [{
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.market,
          where: marketFilter
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.eventMarketOutcome,
          as: 'outcomes',
          order: [[this.args.orderBy, this.args.order]]
        }],
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { eventMarkets: eventMarkets.rows, page, totalPages: Math.ceil(eventMarkets.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
