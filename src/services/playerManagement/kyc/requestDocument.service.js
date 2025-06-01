import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SendDocumentRequestEmailService } from '@src/services/emailTemplates/sendDocumentRequestEmail.service'
import { DOCUMENT_STATUS_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    userId: { type: 'string' },
    reason: { type: 'string' },
    documentLabelId: { type: 'number' }
  },
  required: ['documentLabelId', 'userId', 'adminUserId']
})

export class RequestDocumentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
    const reason = this.args.reason
    const adminUserId = this.args.adminUserId
    const transaction = this.context.sequelizeTransaction

    try {
      const user = await this.context.sequelize.models.user.findOne({
        attributes: ['id', 'email', 'username', 'emailVerified'],
        where: { id: userId },
        include: [{
          attributes: ['code'],
          model: this.context.sequelize.models.language
        }, {
          model: this.context.sequelize.models.document,
          where: { documentLabelId: this.args.documentLabelId },
          required: false,
          include: {
            attributes: ['name'],
            model: this.context.sequelize.models.documentLabel
          }
        }],
        transaction
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (!user.emailVerified) return this.addError('EmailNotVerifiedErrorType')

      const document = user.documents[0]
      const documentLabel = document ? document.documentLabel : await this.context.sequelize.models.documentLabel.findOne({ where: { id: this.args.documentLabelId }, transaction })
      if (!documentLabel) return this.addError('DocumentLabelDoesNotExistsErrorType')

      if (document) {
        document.actioneeId = adminUserId
        document.status = DOCUMENT_STATUS_TYPES.REQUESTED
        await document.save({ transaction })
      } else {
        await this.context.sequelize.models.document.create({
          userId: user.id,
          comment: reason,
          actioneeId: adminUserId,
          documentLabelId: documentLabel.id,
          status: DOCUMENT_STATUS_TYPES.REQUESTED
        }, { transaction })
      }

      const { result: emailSent } = await SendDocumentRequestEmailService.execute({
        email: user.email,
        username: user.username,
        language: user.language?.code,
        kycLabel: documentLabel.name
      }, this.context)

      return { emailSent }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
