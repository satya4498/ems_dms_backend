import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { sendEmail } from '@src/libs/emailSender'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { EMAIL_TEMPLATE_EVENT_TYPES } from '@src/utils/constants/public.constants.utils'
import { GetSettingsService } from '../common/getSettings.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    token: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' }
  },
  required: ['token', 'email']
})

export class SendForgotPasswordEmailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const token = this.args.token
    const email = this.args.email
    const username = this.args.username

    try {
      let template = await this.context.sequelize.models.emailTemplate.findOne({ where: { eventType: EMAIL_TEMPLATE_EVENT_TYPES.FORGOT_PASSWORD, isDefault: true } })
      const settings = await GetSettingsService.execute({ keys: [SETTING_KEYS.APPLICATION_NAME, SETTING_KEYS.ADMIN_END_URL, SETTING_KEYS.DEFAULT_SUPPORT, SETTING_KEYS.LOGO] }, this.context)
      if (!template) {
        template = {
          templateCode: `
            <h3>Click on the following link to verify the email address</h3>
            <li>${settings[SETTING_KEYS.ADMIN_END_URL]}/forgot-password?token=${token}<li>
          `
        }
      } else {
        const replaceableData = {
          link: `${settings[SETTING_KEYS.ADMIN_END_URL]}/verify-email?token=${token}`,
          siteName: settings[SETTING_KEYS.APPLICATION_NAME],
          siteLogo: settings[SETTING_KEYS.LOGO]
        }
        template.templateCode = template.templateCode[this.args.language]
        template.dynamicData.forEach(field => {
          template.templateCode = template.templateCode.replace(`{{{${field}}}}`, replaceableData[field])
        })
      }

      const emailSent = await sendEmail(email, username, 'Forgot password', template.templateCode)

      return emailSent
    } catch (error) {
      throw new APIError(error)
    }
  }
}
