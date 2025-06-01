import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { sendEmail } from '@src/libs/emailSender'
import { ServiceBase } from '@src/libs/serviceBase'
import { GetSettingsService } from '@src/services/common/getSettings.service'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { EMAIL_TEMPLATE_EVENT_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    host: { type: 'string' },
    token: { type: 'string' },
    language: { type: 'string' }
  },
  required: ['host', 'token']
})

export class SendPasswordResetEmailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const email = this.args.email
    const username = this.args.username

    try {
      let template = await this.context.sequelize.models.emailTemplate.findOne({ where: { eventType: EMAIL_TEMPLATE_EVENT_TYPES.RESET_PASSWORD, isDefault: true } })
      const settings = await GetSettingsService.execute({ keys: [SETTING_KEYS.APPLICATION_NAME, SETTING_KEYS.ADMIN_END_URL, SETTING_KEYS.DEFAULT_SUPPORT, SETTING_KEYS.LOGO] }, this.context)
      if (!template) {
        template = `
          <h3>Click on the following link to verify the email address</h3>
          <li>${this.args.host}/verify-email?token=${this.args.token}<li>
        `
      } else {
        const replaceableData = {
          link: `${this.args.host}/verify-email?token=${this.argstoken}`,
          siteName: settings[SETTING_KEYS.APPLICATION_NAME],
          siteLogo: settings[SETTING_KEYS.LOGO]
        }
        template.templateCode = template.templateCode[this.args.language]
        template.dynamicData.forEach(field => {
          template.templateCode = template.replace(`{{{${field}}}}`, replaceableData[field])
        })
      }

      const emailSent = await sendEmail(email, username, 'Reset Password', template.templateCode)

      return emailSent
    } catch (error) {
      throw new APIError(error)
    }
  }
}
