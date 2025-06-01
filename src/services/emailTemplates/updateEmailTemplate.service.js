import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { EMAIL_TEMPLATE_EVENT_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    emailTemplateId: { type: 'string' },
    label: { type: 'string' },
    templateCode: { type: 'object' },
    eventType: { enum: Object.values(EMAIL_TEMPLATE_EVENT_TYPES) }
  },
  required: ['emailTemplateId', 'templateCode', 'eventType']
})

export class UpdateEmailTemplatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const label = this.args.label
    const eventType = this.args.eventType
    const templateCode = this.args.templateCode

    try {
      const emailTemplate = await this.context.sequelize.models.emailTemplate.findOne({ where: { id: this.args.emailTemplateId } })
      if (!emailTemplate) return this.addError('EmailTemplateNotFoundErrorType')

      if (label) emailTemplate.label = label
      if (eventType) emailTemplate.eventType = eventType
      if (templateCode) emailTemplate.templateCode = await getLanguageWiseNameJson(templateCode, emailTemplate.templateCode)
      emailTemplate.changed('templateCode', true)
      await emailTemplate.save()
      return { emailTemplate }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
