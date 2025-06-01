import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    language: { type: 'string' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 }
  }
})

export class GetGamificationDataService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, search, perPage } = this.args
    const { gamification: gamificationModel } = this.context.sequelize.models

    const where = {}
    try {
      if (search) where.name = { [Op.iLike]: `%${search}%` }

      const gamificationData = await gamificationModel.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['updatedAt', 'DESC']]
      })

      return { gamification: gamificationData.rows, page, totalPages: Math.ceil(gamificationData.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
