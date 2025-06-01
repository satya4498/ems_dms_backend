import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    currency: { 
      type: 'array', 
      items: { 
        type: 'object',
          properties: {
          code: { type: 'string', enum: ['GC', 'BSC'] },
          coins: { type: 'number'},
        },
        additionalProperties: false,
        required: ['code', 'coins']
      },
    },
    status: { type: 'boolean' },
    limit: { type: 'number', minimum: 1, default: 1 }
  }
})

export class ReferralUpdateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const currency = this.args.currency
    const status = this.args.status
    const limit = this.args.limit

    try {
      const transaction = this.context.sequelizeTransaction

      const referral = await this.context.sequelize.models.setting.findOne({
        where: { key: SETTING_KEYS.REFERRAL }
      })
      if (!referral) return this.addError('ReferralNotExistErrorType')

      const referralData = JSON.parse(referral.value)

      if (currency) referralData.currency = currency
      if (status != null) referralData.isActive = status
      if (limit) referralData.limit = limit
      referral.value = JSON.stringify(referralData)

      await referral.save({ transaction })
      await populateSettingsCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
