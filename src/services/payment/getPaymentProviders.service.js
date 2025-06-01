import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    language: { type: 'string' },
    depositAllowed: { type: 'boolean' },
    withdrawAllowed: { type: 'boolean' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 }
  }
})

export class GetPaymentProvidersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, search, depositAllowed, withdrawAllowed, perPage } = this.args
    const where = {}
    try {
      if (depositAllowed === false || depositAllowed === true) where.depositAllowed = depositAllowed
      if (withdrawAllowed === false || withdrawAllowed === true) where.withdrawAllowed = withdrawAllowed
      // if (search) where.displayName = { EN: { [Op.iLike]: `%${search}%` } }
      if (search) where.name = { EN: { [Op.iLike]: `%${search}%` } }
      const paymentProviders = await this.context.sequelize.models.paymentProvider.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['createdAt', 'DESC']]
      })

      return { paymentProviders: paymentProviders.rows, page, totalPages: Math.ceil(paymentProviders.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
