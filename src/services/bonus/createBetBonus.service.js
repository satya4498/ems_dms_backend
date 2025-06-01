
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusId: { type: 'string' },
    percentage: { type: 'number' },
    wageringTemplateId: { type: 'string' },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          zeroOutThreshold: { type: 'number', minimum: 1, default: 1 },
          currencyId: { type: 'string' },
          maxBonusClaimed: { type: 'number', minimum: 1 },
          minBetAmount: { type: 'number', minimum: 1 }
        },
        required: ['minBetAmount'],
        additionalProperties: false
      }
    }

  },
  required: ['bonusId', 'currencyDetails', 'wageringTemplateId']
})

export class CreateBetBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const currencyDetails = this.args.currencyDetails
    const bonusId = this.args.bonusId

    try {
      if (currencyDetails.minBetAmount <= 0) return this.addError('MinBetAmountRequiredErrorType')
      const bonus = await this.context.sequelize.models.betBonus.upsert({
        bonusId,
        wageringTemplateId: this.args.wageringTemplateId,
        percentage: this.args.percentage
      }, { transaction: this.context.sequelizeTransaction })

      return { bonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
