import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _, { isBoolean } from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    isActive: { type: 'boolean' },
    searchString: { type: 'string' },
    sportsData: { type: 'boolean', default: true },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'providerId', 'name'], default: 'id' }
  }
})

export class GetSportsOrLocationsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const isActive = this.args.isActive
    const searchString = this.args.searchString

    try {
      const where = {}
      if (searchString) where.name = { [Op.iLike]: `%${searchString}%` }
      if (isBoolean(isActive)) where.isActive = isActive

      const model = this.args.sportsData ? this.context.sequelize.models.sport : this.context.sequelize.models.location
      const data = await model.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { [_.camelCase(model.tableName)]: data.rows, page, totalPages: Math.ceil(data.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
