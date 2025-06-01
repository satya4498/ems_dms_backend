import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { DOCUMENT_STATUS_TYPES } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    kycRejectDescription: { type: 'string' },
    documentsData: { type: 'array' },
    adminUserId: {type: 'string'}

  },
  required: ['adminUserId','userId', 'kycRejectDescription']
})

export class InactiveKycService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const userId = this.args.userId
    const transaction = this.context.sequelizeTransaction
    const adminUserId = this.args.adminUserId
    const kycRejectDescription = this.args.kycRejectDescription

    try {
      const user = await this.context.sequelize.models.user.findOne({
        attributes: ['id', 'kycStatus'],
        where: { id: userId },
        transaction
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')

      if (this.args?.documentsData?.length > 0) {

        for (let document of this.args.documentsData) {
          const documents = await this.context.sequelize.models.document.findOne({
            where: { userId, documentLabelId: document.documentLabelId },
            transaction
          })
          if (!documents) return this.addError('DocumentsNotAvailableErrorType')
          documents.status = DOCUMENT_STATUS_TYPES.REJECTED
          documents.kycRejectDescription = kycRejectDescription
          documents.actioneeId=adminUserId
          await documents.save({ transaction })
        }
      } else {
        const documents = await this.context.sequelize.models.document.findAll({
          where: {
            userId
          },
          transaction
        })
        if (!documents) return this.addError('DocumentsNotAvailableErrorType')
        for (const doc of documents) {
          doc.status = DOCUMENT_STATUS_TYPES.REJECTED
          doc.kycRejectDescription = kycRejectDescription
          doc.actioneeId=adminUserId
          await doc.save({ transaction })
        }
      }
      user.kycStatus = false
      user.kycRejectDescription = kycRejectDescription
      user.kycMethod = null
      await user.save({ transaction })
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
