import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    searchString: { type: 'string' },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'providerId', 'name'], default: 'id' }
  }
})

export class GetMarketsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const searchString = this.args.searchString

    try {
      const where = {}
      if (searchString) where.name = { [Op.iLike]: `%${searchString}%` }

      const markets = await this.context.sequelize.models.market.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { markets: markets.rows, page, totalPages: Math.ceil(markets.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
