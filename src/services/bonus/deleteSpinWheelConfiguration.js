import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const schema = {
  type: 'object',
  properties: {
    spinWheelConfigId: { type: 'number' }
  },
  required: ['spinWheelConfigId']
}

const constraints = ajv.compile(schema)

export class DeleteSpinWheelConfigService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { spinWheelConfigId } = this.args
    const transaction = await this.context.sequelize.transaction() // Start a new transaction

    try {
      const spinWheelConfigModel = this.context.sequelize.models.wheelDivisionConfiguration

      const spinWheelConfig = await spinWheelConfigModel.findOne({
        where: { id: spinWheelConfigId },
        transaction,
        lock: transaction.LOCK.UPDATE
      })

      if (!spinWheelConfig) {
        await transaction.rollback()
        return this.addError('SpinWheelConfigurationNotFoundError')
      }
      await spinWheelConfig.destroy({ transaction })

      await transaction.commit()

      return { success: true }
    } catch (error) {
      await transaction.rollback()
      throw new APIError(error)
    }
  }
}
