import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    wheelDivisionId: { type: 'string' },
    sc: { type: 'number', minimum: 0 },
    gc: { type: 'number', minimum: 0 },
    isAllow: { type: 'boolean' },
    playerLimit: { type: ['integer', 'null'] },
    probability: { type: 'number' }
  },
  required: ['wheelDivisionId']
})

export class UpdateSpinWheelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { wheelDivisionId, sc, gc, probability, isAllow, playerLimit } = this.args

    const checkWheelConfigExists = await this.context.sequelize.models.wheelDivisionConfiguration.findOne({
      where: { id: wheelDivisionId },
      transaction: this.context.sequelizeTransaction
    })

    if (!checkWheelConfigExists) return this.addError('NotFoundErrorType')

    if (Number(wheelDivisionId) === 1) {
      await this.context.sequelize.models.wheelDivisionConfiguration.update({ sc, gc, probability },
        {
          where: { id: wheelDivisionId },
          data: { sc, gc, probability },
          transaction: this.context.sequelizeTransaction

        })
    } else {
      if (playerLimit === '') {
        playerLimit = null
      }
      await this.context.sequelize.models.wheelDivisionConfiguration.update(
        { id: wheelDivisionId, sc, gc, isAllow, playerLimit, probability },
        {
          where: { id: wheelDivisionId },
          transaction: this.context.sequelizeTransaction

        })
    }

    return { wheelDivisionId: wheelDivisionId }
  }
}
