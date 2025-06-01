import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 },
    search: { type: 'string' },
    wageringTemplateId: { type: 'string' },
    providerId: { type: 'string' }
  },
  required: ['wageringTemplateId']
})

export class GetWageringTemplateDetailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { wageringTemplateId, providerId, search, page, perPage } = this.args
    const where = {}
    try {
      if (search) where.name = { EN: { [Op.iLike]: `%${search}%` } }
      if (providerId) where.casinoProviderId = providerId

      const template = await this.context.sequelize.models.wageringTemplate.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { id: wageringTemplateId },
        include:
        {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.wageringTemplateGameDetail,
          include: {
            attributes: ['id', 'casinoProviderId', 'returnToPlayer', 'name'],
            where,
            model: this.context.sequelize.models.casinoGame
          }
        },
        limit: perPage,
        offset: (page - 1) * perPage
      })

      if (!template) return this.addError('WageringTemplateNotFoundErrorType')
      return { template: template.rows, page, totalPages: Math.ceil(template.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
