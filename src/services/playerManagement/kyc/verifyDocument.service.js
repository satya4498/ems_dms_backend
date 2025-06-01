import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SendDocumentVerificationEmailService } from '@src/services/emailTemplates/sendDocumentVerificationEmail.service'
import { DOCUMENT_STATUS_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    adminUserId: { type: 'string' },
    userDocumentId: { type: 'string' }
  },
  required: ['userId', 'userDocumentId', 'adminUserId']
})

export class VerifyDocumentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
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
          where: { id: this.args.userDocumentId },
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

      document.actioneeId = adminUserId
      document.status = DOCUMENT_STATUS_TYPES.APPROVED
      document.kycRejectDescription = null
      await document.save({ transaction })

      const { result: emailSent } = await SendDocumentVerificationEmailService.execute({
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
