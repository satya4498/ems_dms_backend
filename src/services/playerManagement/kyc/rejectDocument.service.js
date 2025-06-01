import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SendDocumentRejectionEmailService } from '@src/services/emailTemplates/sendDocumentRejectionEmail.service'
import { DOCUMENT_STATUS_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'number' },
    adminUserId: { type: 'string' },
    documentLabelId: { type: 'number' },
    reason: { type: 'string' }
  },
  required: ['userId', 'documentLabelId', 'adminUserId']
})

export class RejectDocumentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
    const reason = this.args.reason
    const adminUserId = this.args.adminUserId
    const transaction = this.context.transaction

    try {
      const user = await this.context.sequelize.models.user.findOne({
        attributes: ['id', 'email', 'username'],
        where: { id: userId },
        include: [{
          attributes: ['code'],
          model: this.context.sequelize.models.language
        }, {
          model: this.context.sequelize.models.document,
          where: { documentLabelId: this.args.documentLabelId },
          include: {
            attributes: ['name'],
            model: this.context.sequelize.models.documentLabel
          }
        }],
        transaction
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')

      const document = user.documents[0]
      if (!document) return this.addError('DocumentsNotAvailableErrorType')

      document.comment = reason
      document.actioneeId = adminUserId
      document.status = DOCUMENT_STATUS_TYPES.REJECTED

      await document.save({ transaction })
      const { result: emailSent } = await SendDocumentRejectionEmailService.execute({
        email: user.email,
        username: user.username,
        language: user.language?.code,
        kycLabel: document.documentLabel.name
      }, this.context)

      return { emailSent }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
