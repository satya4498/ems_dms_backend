import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    wheelDivisionConfigurationId: { type: 'number' },
    probability: { type: 'number' },
    gc: { type: 'number' },
    sc: { type: 'number' },
  },
  required: ['wheelDivisionConfigurationId']
})

export class UpdateSpinWheelBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { wheelDivisionConfigurationId, gc, sc, probability } = this.args
    const { sequelize, models } = this.context
    const transaction = await sequelize.transaction()

    try {
      const spinWheelBonus = await models.wheelDivisionConfiguration.findByPk(wheelDivisionConfigurationId, { transaction })

      if (!spinWheelBonus) {
        await transaction.rollback()
        return this.addError('WheelDivisionConfigurationNotFound')
      }
      
      if(probability) spinWheelBonus.probability = probability 
      if(gc) spinWheelBonus.gc = gc
      if(sc) spinWheelBonus.sc = sc

      await spinWheelBonus.save({ transaction }) 
      await transaction.commit()

      return { message: 'Wheel Division Configurations updated successfully' }
    } catch (error) {
      await transaction.rollback()
      throw new APIError(error)
    }
  }
}
