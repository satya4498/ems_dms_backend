import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 },
    searchString: { type: 'string' },
    order: { type: 'string', default: 'ASC' },
    orderBy: { type: 'string', default: 'id' }
  }
})

export class GetAllWageringTemplatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const searchString = this.args.searchString
    try {
      const where = {}
      if (searchString) where.name = { [Op.iLike]: searchString }

      const wageringTemplates = await this.context.sequelize.models.wageringTemplate.findAndCountAll({
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]],
        raw: true
      })

      if (!wageringTemplates) return this.addError('WageringTemplateNotFoundErrorType')
      return { wageringTemplates: wageringTemplates.rows, page, totalPages: Math.ceil(wageringTemplates.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
