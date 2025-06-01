import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 }
  }
})

export class GetAllLoyaltyLevelsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, search, isActive, perPage } = this.args
    const where = {}

    try {
      if (search) where.name = { [Op.iLike]: `%${search}%` }

      const loyaltyLevels = await this.context.sequelize.models.loyaltyLevel.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        order: [['level', 'ASC']],
        limit: parseInt(perPage, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(perPage, 10)
      })

      return { loyaltyLevels: loyaltyLevels.rows, page, totalPages: Math.ceil(loyaltyLevels.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
