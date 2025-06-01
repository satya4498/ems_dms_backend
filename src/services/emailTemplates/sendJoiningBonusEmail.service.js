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
    email: { type: 'string' },
    language: { type: 'string', default: 'EN' },
    username: { type: 'string' },
    amount: { type: 'string' }
  },
  required: ['username', 'email']
})

export class SendJoiningBonusEmailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let template = ''
    const email = this.args.email
    const username = this.args.username

    try {
      const emailTemplate = await this.context.sequelize.models.emailTemplate.findOne({ where: { eventType: EMAIL_TEMPLATE_EVENT_TYPES.JOINING_BONUS, isDefault: true }, transaction: this.context.sequelizeTransaction })
      const settings = await GetSettingsService.execute({ keys: [SETTING_KEYS.APPLICATION_NAME, SETTING_KEYS.USER_END_URL, SETTING_KEYS.DEFAULT_SUPPORT, SETTING_KEYS.LOGO] }, this.context)
      if (!emailTemplate) {
        template = {
          templateCode: `
            <h3>You got the Joining Bonus.</h3>`
        }
      } else {
        const replaceableData = {
          userName: username,
          joiningAmount: this.args.amount,
          siteName: settings[SETTING_KEYS.APPLICATION_NAME]

        }
        template = emailTemplate.templateCode[this.args.language]
        emailTemplate.dynamicData.forEach(field => {
          template = template.replace(`{{${field}}}`, replaceableData[field])
        })
      }

      const emailSent = await sendEmail(email, username, 'Joining Bonus', template)

      return emailSent
    } catch (error) {
      throw new APIError(error)
    }
  }
}
