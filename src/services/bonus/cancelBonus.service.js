import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userBonusId: { type: 'string' },
    adminUserId: { type: 'string' }
  },
  required: ['userBonusId']
})

export class CancelBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userBonusId = this.args.userBonusId
    const transaction = this.context.sequelizeTransaction

    try {
      const userBonus = await this.context.models.userBonus.findOne({
        where: { id: userBonusId },
        include: {
          attributes: [],
          model: this.context.models.bonus
        },
        transaction
      })

      if (!userBonus) return this.addError('UserDoesNotExistsErrorType')
      userBonus.status = USER_BONUS_STATUS_VALUES.CANCELLED
      userBonus.cancelledBy = this.args.adminUserId
      await userBonus.save({ transaction })

      // TODO
      // create transaction to deduct amount from wallets according to bonus type.

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
