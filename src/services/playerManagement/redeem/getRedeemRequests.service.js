import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 },
  }
})

export class GetReedemRequestsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, perPage } = this.args
    try {

      const redeemRequests = await this.context.sequelize.models.withdrawal.findAndCountAll({
        attributes: { exclude: ['createdAt','updatedAt'] },
        include: {
          attributes: ['id','username'],
          model: this.context.sequelize.models.user
        },
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['createdAt', 'DESC']]
      })

      return { redeemRequests: redeemRequests.rows, page, totalPages: Math.ceil(redeemRequests.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
