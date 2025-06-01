import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    isActive: { type: 'boolean' },
    searchString: { type: 'string' },
    packageIds: { type: 'array', default: [] },
    page: { type: 'number', minimum: 1, default: 1 },
    reorder: { type: 'boolean' },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'label', 'gcCoin', 'scCoin', 'createdAt', 'orderId', 'updatedAt'], default: 'createdAt' },
  },
})

export class GetPackagesService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    try {
      const { page, perPage, order, orderBy, searchString, isActive, reorder, packageIds } = this.args

      const where = {}
      if (packageIds.length) where.id = { [Op.in]: packageIds }
      if (_.isBoolean(isActive)) where.isActive = isActive
      if (searchString) {
        where.lable = { [Op.iLike]: `%${searchString}%` }
      }
      if (reorder) {
        return await this.context.sequelize.models.package.findAll({
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        })
      } else {
        const { count, rows } = await this.context.sequelize.models.package.findAndCountAll({
          attributes: { exclude: ['updatedAt', 'createdAt'] },
          where,
          limit: perPage,
          offset: (page - 1) * perPage,
          order: [[orderBy, order]]
        })
        return { packages: rows, page, totalPages: Math.ceil(count / perPage) }
      }

    } catch (error) {
      throw new APIError(error)
    }
  }
}
