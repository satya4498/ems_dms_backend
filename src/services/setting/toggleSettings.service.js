import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { GetSettingsService } from './getSettings.service'
import { createActivityLogsService } from '../adminActivityLogs/createActivityLogs.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    key: { enum: [SETTING_KEYS.ALLOW_BETTING, SETTING_KEYS.MAINTENANCE, SETTING_KEYS.SPORTSBOOK, SETTING_KEYS.CASINO, SETTING_KEYS.ENABLE_2FA] },
    modulePermissions: { type: 'object' },
    adminId: { type: 'string' }
  },
  required: ['key']
})

export class ToggleSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { args: { key, modulePermissions, adminId } } = this
    try {
      const { result: settings } = await GetSettingsService.execute({ keys: [key] }, this.context)
      await this.context.sequelize.models.setting.update({
        value: String(!settings[key])
      }, {
        where: { key }
      })

      await populateSettingsCache()

      // create a activity log
      await createActivityLogsService.execute({ module: modulePermissions.module, activity: modulePermissions.permission, adminId, fieldsAffected: { [key]: String(!settings[key]) } }, this.context)

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
