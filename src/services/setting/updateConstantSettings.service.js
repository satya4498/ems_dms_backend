import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    applicationName: { type: 'string' },
    userEndUrl: { type: 'string', format: 'uri' },
    adminEndUrl: { type: 'string', format: 'uri' },
    defaultSupport: { type: 'string', format: 'email' },
    enable2fa: {type: 'boolean'}
  }
})

export class UpdateConstantSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userEndUrl = this.args.userEndUrl
    const adminEndUrl = this.args.adminEndUrl
    const defaultSupport = this.args.defaultSupport
    const applicationName = this.args.applicationName
    const enable2fa=this.args.enable2fa

    try {
      const updatedSettings = []

      if (userEndUrl) updatedSettings.push({ key: SETTING_KEYS.USER_END_URL, value: userEndUrl, dataType: SETTING_DATA_TYPES.STRING })
      if (adminEndUrl) updatedSettings.push({ key: SETTING_KEYS.ADMIN_END_URL, value: adminEndUrl, dataType: SETTING_DATA_TYPES.STRING })
      if (defaultSupport) updatedSettings.push({ key: SETTING_KEYS.DEFAULT_SUPPORT, value: defaultSupport, dataType: SETTING_DATA_TYPES.STRING })
      if (applicationName) updatedSettings.push({ key: SETTING_KEYS.APPLICATION_NAME, value: applicationName, dataType: SETTING_DATA_TYPES.STRING })
      if (enable2fa) updatedSettings.push({key: SETTING_KEYS.ENABLE_2FA, value: enable2fa, dataType: SETTING_DATA_TYPES.BOOLEAN})

      await this.context.sequelize.models.setting.bulkCreate(updatedSettings, {
        updateOnDuplicate: ['value']
      })

      await populateSettingsCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
