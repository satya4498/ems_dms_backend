import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    providerId: { type: 'string' }
  },
  required: ['providerId']
})

export class GetPaymentProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const paymentProvider = await this.context.sequelize.models.paymentProvider.findOne({
        where: { id: this.args.providerId },
        include: {
          model: this.context.sequelize.models.providerLimit,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            model: this.context.sequelize.models.currency,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      })

      return { paymentProvider }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
