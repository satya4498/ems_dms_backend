import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { EMAIL_TEMPLATE_EVENT_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    label: { type: 'string' },
    templateCode: { type: 'object' },
    isDefault: { type: 'boolean', default: false },
    eventType: { enum: Object.values(EMAIL_TEMPLATE_EVENT_TYPES) }
  },
  required: ['templateCode', 'eventType']
})

export class CreateEmailTemplatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const label = this.args.label
    const isDefault = this.args.isDefault
    const eventType = this.args.eventType
    const templateCode = this.args.templateCode

    const transaction = this.context.sequelizeTransaction
    const emailTemplate = this.context.sequelize.models.emailTemplate

    try {
      const emailTemplates = await emailTemplate.findOne({ where: { eventType, isDefault: true }, raw: true, transaction })
      if (!emailTemplates) return this.addError('NoExistingTemaplateFoundForThisEventTypeErrorType')

      if (isDefault) await emailTemplate.update({ isDefault: false }, { where: { eventType }, transaction })

      const updatedTemplateCode = await getLanguageWiseNameJson(templateCode)
      const emailTemaplate = await this.context.sequelize.models.emailTemplate.create({
        label,
        eventType,
        isDefault,
        templateCode: updatedTemplateCode,
        dynamicData: emailTemplates.dynamicData
      }, { transaction })

      return { emailTemaplate }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
