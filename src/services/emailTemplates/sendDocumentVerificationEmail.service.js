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
    kycLabel: { type: 'string' },
    email: { type: 'string' },
    language: { type: 'string', default: 'EN' },
    username: { type: 'string' }
  },
  required: ['username', 'email']
})

export class SendDocumentVerificationEmailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const email = this.args.email
    const username = this.args.username

    try {
      let template = await this.context.sequelize.models.emailTemplate.findOne({ where: { eventType: EMAIL_TEMPLATE_EVENT_TYPES.DOCUMENT_VERIFIED, isDefault: true } })
      const settings = await GetSettingsService.execute({ keys: [SETTING_KEYS.APPLICATION_NAME, SETTING_KEYS.ADMIN_END_URL, SETTING_KEYS.DEFAULT_SUPPORT, SETTING_KEYS.LOGO] }, this.context)
      if (!template) {
        template = {
          templateCode: `
            <h3>Your ${this.args.kycLabel} Approved.</h3>`
        }
      } else {
        const replaceableData = {
          kycLabels: this.args.kycLabel,
          siteName: settings[SETTING_KEYS.APPLICATION_NAME],
          siteLogo: settings[SETTING_KEYS.LOGO]
        }
        template.templateCode = template.templateCode[this.args.language]
        template.dynamicData.forEach(field => {
          template.templateCode = template.templateCode.replace(`{{{${field}}}}`, replaceableData[field])
        })
      }

      const emailSent = await sendEmail(email, username, 'Document Approved', template.templateCode)

      return emailSent
    } catch (error) {
      throw new APIError(error)
    }
  }
}
