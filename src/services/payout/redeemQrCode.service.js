import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { AddBankAccountService } from '@src/services/razorpay/addBankAccount.service'

const redeemQrCodeConstraints = ajv.compile({
  type: 'object',
  properties: {
    code: { type: 'string' },
    userId: { type: 'string' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    ifsc: { type: 'string', minLength: 11, maxLength: 11 },
    accountNumber: { type: 'string', minLength: 9, maxLength: 18 }
  },
  required: ['code', 'userId']
})

export class RedeemQrCodeService extends ServiceBase {
  get constraints () {
    return redeemQrCodeConstraints
  }

  async run () {
    try {
      const { code, userId, name, ifsc, accountNumber } = this.args

      // Check if user exists
      const user = await this.context.sequelize.models.user.findByPk(userId)
      if (!user) {
        return this.addError('UserNotFoundErrorType', 'User not found')
      }

      // Check if QR code exists and is valid
      const qrCode = await this.context.sequelize.models.payoutQrCode.findOne({
        where: { code }
      })
      if (!qrCode) {
        return this.addError('QrCodeNotFoundErrorType', 'QR code not found')
      }

      // Check if user has already scanned this QR code
      const existingRedemption = await this.context.sequelize.models.payoutQrCodeRedemption.findOne({
        where: {
          qrCodeId: qrCode.id,
          userId
        }
      })

      if (!existingRedemption) {
        return this.addError('QrCodeNotScannedErrorType', 'QR code must be scanned first before requesting redemption')
      }

      if (existingRedemption.status === 'pending') {
        return this.addError('RedemptionAlreadyPendingErrorType', 'Redemption request is already pending for this QR code')
      }

      if (existingRedemption.status === 'approved') {
        return this.addError('RedemptionAlreadyApprovedErrorType', 'Redemption has already been approved for this QR code')
      }

      if (existingRedemption.status === 'rejected') {
        return this.addError('RedemptionRejectedErrorType', 'Redemption has been rejected for this QR code')
      }

      // Create fund account if not already present
      let fundAccountId = user.fundAccountId
      if (!fundAccountId) {
        const result = await AddBankAccountService.execute({
          userId,
          contactId: user.contactId,
          name,
          ifsc,
          accountNumber
        }, this.context)
        if (result.errors) {
          return result
        }
        fundAccountId = result.data.fundAccountId
      }
      this.log.info('Fund Account Created', {
        message: 'Fund account created successfully',
        context: { userId, fundAccountId }
      })

      // Update redemption status to pending
      await existingRedemption.update({ status: 'pending' })

      // Fetch the updated redemption with related data
      const redemptionWithDetails = await this.context.sequelize.models.payoutQrCodeRedemption.findOne({
        where: { id: existingRedemption.id },
        include: [
          {
            model: this.context.sequelize.models.payoutQrCode,
            as: 'payoutQrCode'
          },
          {
            model: this.context.sequelize.models.user,
            as: 'user'
          }
        ]
      })

      this.log.info('QR Code Redemption Request Created', {
        message: 'Redemption request created successfully for scanned QR code.',
        context: {
          qrCodeId: qrCode.id,
          userId,
          redemptionId: existingRedemption.id,
          amount: qrCode.amount
        }
      })

      return {
        redemption: redemptionWithDetails,
        message: 'Redemption request submitted successfully for admin approval.'
      }
    } catch (err) {
      this.log.error('QR Code Redemption Failed', {
        message: err.message,
        context: { code: this.args.code, userId: this.args.userId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
