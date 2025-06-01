import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { WAGERING_TYPES } from '@src/utils/constants/bonus.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    wageringMultiplier: { type: 'string', default: 1 },
    wageringRequirementType: { enum: Object.values(WAGERING_TYPES), default: WAGERING_TYPES.BONUS_PLUS_CASH },
    gameContributions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          casinoGameId: { type: 'number' },
          contributionPercentage: { type: 'number' }
        }
      }
    }
  },
  required: ['name', 'gameContributions']
})

export class CreateWageringTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    try {
      const [created] = await this.context.sequelize.models.wageringTemplate.findOrCreate({
        where: { name: this.args.name },
        defaults: {
          name: this.args.name,
          wageringTemplateGameDetails: this.args.gameContributions,
          wageringMultiplier: this.args.wageringMultiplier,
          wageringRequirementType: this.args.wageringRequirementType
        },
        include: { model: this.context.sequelize.models.wageringTemplateGameDetail },
        transaction: transaction
      })
      if (!created) return this.addError('WageringTemplateExistsErrorType')
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
