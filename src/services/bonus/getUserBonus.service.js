import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'number' },
    status: { type: 'string' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 }
  },
  required: ['userId']
})

export class GetUserBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const perPage = this.args.perPage
    const page = this.args.page
    const status = this.args.status
    const where = { userId: this.args.userId }

    try {
      if (status) where.status = this.args.status

      const userBonus = await this.context.sequelize.models.userBonus.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        include: {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.bonus
        },
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: (page - 1) * perPage
      })

      return { userBonus: userBonus.rows, page, totalPages: Math.ceil(userBonus.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
