import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusId: { type: 'number' }
  },
  required: ['bonusId']
})

export class ToggleBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const bonus = await this.context.sequelize.models.bonus.findOne({
        attributes: ['id', 'isActive', 'claimedCount'],
        where: { id: this.args.bonusId }
      })
      if (!bonus) return this.addError('BonusDoesNotExistsErrorType')

      // if (bonus.claimedCount > 0) return this.addError('BonusUnderClaimExistsErrorType')

      bonus.isActive = !bonus.isActive
      await bonus.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
