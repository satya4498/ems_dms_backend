import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    order: { type: 'array' }
  },
  required: ['order']
})

export class ReorderBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const bonuses = [...(new Set(this.args.order))]
    const transaction = this.context.sequelizeTransaction

    try {
      await Promise.all(bonuses.map(async (bonusId, index) => {
        await this.context.sequelize.models.bonus.update({ orderId: index + 1 }, { where: { id: bonusId }, transaction })
      }))
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
