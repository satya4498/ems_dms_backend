import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { isBoolean } from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    isActive: { type: 'boolean' },
    searchString: { type: 'string' },
    sportId: { type: 'string' },
    locationId: { type: 'string' },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'providerId', 'name'], default: 'id' }
  }
})

export class GetLeaguesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const isActive = this.args.isActive
    const searchString = this.args.searchString
    const sportId = this.args.sportId
    const locationId = this.args.locationId

    try {
      const where = {}

      if (sportId) where.sportId = sportId
      if (locationId) where.locationId = locationId
      if (isBoolean(isActive)) where.isActive = isActive
      if (searchString) where.name = { [Op.iLike]: `%${searchString}%` }

      const leagues = await this.context.sequelize.models.league.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { leagues: leagues.rows, page, totalPages: Math.ceil(leagues.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
