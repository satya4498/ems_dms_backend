import { APIError } from '@src/errors/api.error'
import { getExpireAt } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    key: {
      enum: [
        USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_PURCHASE_LIMIT,
        USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_PURCHASE_LIMIT,
        USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_PURCHASE_LIMIT,
        USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_LOSS_LIMIT,
        USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_LOSS_LIMIT,
        USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_LOSS_LIMIT
      ]
    },
    value: { type: 'string' },
    reset: { type: 'boolean' },
    userId: { type: 'number' }
  },
  required: ['userId', 'key', 'value']
})

export class UpdateDepositAndLossLimitsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const key = this.args.key
    const value = this.args.value.split('.')[0]
    const reset = this.args.reset
    const transaction = this.context.sequelizeTransaction

    try {
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: this.args.userId },
        include: {
          model: this.context.sequelize.models.userLimit,
          where: { key }
        },
        transaction
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')

      const limit = user.userLimits[0]
      const limitData = reset ? { value: '', expireAt: null } : { value, expireAt: getExpireAt(key, limit.expireAt) }
      limit.value = limitData.value
      limit.expireAt = limitData.expireAt
      await limit.save({ transaction })
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
