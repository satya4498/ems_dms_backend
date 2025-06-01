import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { SELF_EXCLUSION_TYPES, USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  anyOf: [{
    type: 'object',
    properties: {
      userId: { type: 'string' },
      expireIn: { type: 'number' },
      value: { const: SELF_EXCLUSION_TYPES.TEMPORARY },
      reset: { type: 'boolean' },
      key: { type: 'string', enum: Object.values(USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES) }
    },
    required: ['userId', 'expireIn', 'key']
  }, {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      reset: { type: 'boolean' },
      value: { const: SELF_EXCLUSION_TYPES.PERMANENT },
      key: { type: 'string', enum: Object.values(USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES) }
    },
    required: ['userId', 'key']
  }]
})

export class UpdateSelfExclusionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
    const reset = this.args.reset
    const value = this.args.value
    const key = this.args.key
    const transaction = this.context.sequelizeTransaction

    try {
      const userLimit = await this.context.sequelize.models.userLimit.findOne({
        where: { userId, key },
        transaction
      })
      if (!userLimit) return this.addError('LimitDoesNotExistsErrorType')

      const limitData = reset ? { value: '', expireAt: null } : { value, expireAt: this.expireAt }
      userLimit.value = limitData.value
      if (value === SELF_EXCLUSION_TYPES.TEMPORARY) userLimit.expireAt = limitData.expireAt
      if (value === SELF_EXCLUSION_TYPES.PERMANENT && key===USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.TEMPORARY_DISABLED) userLimit.disabledCount = 0
      await userLimit.save({ transaction })

      return { userLimit }
    } catch (error) {
      throw new APIError(error)
    }
  }

  get expireAt () {
    if (!this.args.expireIn || this.args.value === SELF_EXCLUSION_TYPES.PERMANENT) return ''
    return serverDayjs().add(this.args.expireIn, 'd')
  }
}
