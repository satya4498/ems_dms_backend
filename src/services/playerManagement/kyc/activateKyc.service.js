import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SendKycActivatedEmailService } from '@src/services/emailTemplates/sendKycActivatedEmail.service'
import { KYC_METHODS } from '@src/utils/constants/app.constants'
import { DOCUMENT_STATUS_TYPES } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'
const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    adminUserId: { type: 'string'}
  },
  required: ['userId', 'adminUserId']
})

export class ActivateKycService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    console.log(this.args)
    const userId = this.args.userId
    const transaction = this.context.sequelizeTransaction
    const adminUserId = this.args.adminUserId

    try {
      const user = await this.context.sequelize.models.user.findOne({
        attributes: ['id', 'email', 'username', 'kycStatus'],
        where: { id: userId },
        include: [{
          attributes: ['code'],
          model: this.context.sequelize.models.language
        }, {
          model: this.context.sequelize.models.document,
          where: { status: { [Op.ne]: null } },
          include: [{
            model: this.context.sequelize.models.documentLabel
          }],
          separate: true
        },
      ],
        transaction
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
         const requiredDocuments = await this.context.sequelize.models.documentLabel.findAndCountAll({
        where: { required: true },
        })
      const document = user.documents
      const checkRequiredDocs = document.filter(each => each?.documentLabel?.required===true)
   
      if (checkRequiredDocs.length!==requiredDocuments.count) return this.addError('DocumentsRequiredBeforeProceedingErrorType')

        for (const eachDocument of document) {
          eachDocument.status = DOCUMENT_STATUS_TYPES.APPROVED 
          eachDocument.actioneeId = adminUserId
          eachDocument.kycRejectDescription = ''
          await eachDocument.save({ transaction })
        }
      user.kycStatus = true
      user.kycRejectDescription = ''
      user.kycMethod = KYC_METHODS.MANUAL
      await user.save({ transaction })

      await SendKycActivatedEmailService.execute({
        email: user.email,
        username: user.username,
        language: user.language?.code
      }, this.context)

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
