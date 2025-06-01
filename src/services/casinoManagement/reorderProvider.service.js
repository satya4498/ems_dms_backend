import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    providerIds: { type: 'array' }
  },
  required: ['providerIds']
})

export class ReorderProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const providersIds = [...(new Set(this.args.providerIds))]
    const transaction = this.context.sequelizeTransaction

    try {
      await Promise.all(providersIds.map(async (providersId, index) => {
        await this.context.sequelize.models.casinoProvider.update({ orderId: index + 1 }, { where: { id: providersId }, transaction })
      }))

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
