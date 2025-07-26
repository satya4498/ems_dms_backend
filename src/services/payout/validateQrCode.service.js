import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { NumberPrecision } from '@src/libs/numberPrecision'

const validateQrCodeConstraints = ajv.compile({
  type: 'object',
  properties: {
    code: { type: 'string' },
    userId: { type: 'string' }
  },
  required: ['code', 'userId']
})

export class ValidateQrCodeService extends ServiceBase {
  get constraints () {
    return validateQrCodeConstraints
  }

  async run () {
    try {
      const { code, userId } = this.args

      // Check if user exists
      const user = await this.context.sequelize.models.user.findByPk(userId)
      if (!user) {
        return this.addError('UserNotFoundErrorType', 'User not found')
      }

      // Check if QR code exists and is valid
      const qrCode = await this.context.sequelize.models.payoutQrCode.findOne({
        where: {
          code
        }
      })
      if (!qrCode) {
        return this.addError('QrCodeNotFoundErrorType', 'QR code not found')
      }

      // Check if user has already scanned this QR code
      const existingRedemption = await this.context.sequelize.models.payoutQrCodeRedemption.findOne({
        where: {
          qrCodeId: qrCode.id
        }
      })

      if (existingRedemption) {
        if (existingRedemption?.userId === userId) {
          return {
            success: false,
            message: 'You have already scanned this QR code',
            qrCodeId: qrCode?.id
          }
        }
        const redeemedUser = await this.context.sequelize.models.user.findByPk(existingRedemption.userId)
        return {
          success: false,
          message: `This QR code has already been scanned by ${redeemedUser?.firstName || 'user'} ${redeemedUser?.lastName || ''}`,
          qrCodeId: qrCode?.id
        }
      }

      // Get user's wallet
      const wallet = await this.context.sequelize.models.wallet.findOne({
        where: { userId },
        include: {
          model: this.context.sequelize.models.currency
        }
      })

      if (!wallet) {
        return this.addError('WalletNotFoundErrorType', 'User wallet not found')
      }

      // Add balance to wallet immediately
      const currentBalance = wallet.balance
      const creditAmount = qrCode.amount
      const newBalance = NumberPrecision.plus(currentBalance, creditAmount)

      // Update wallet balance
      await wallet.update({ balance: newBalance })

      // Create transaction record for wallet credit
      const transaction = await this.context.sequelize.models.transaction.create({
        walletId: wallet.id,
        amount: creditAmount,
        type: 'credit',
        reference: `QR_SCAN_${qrCode.id}`
      })

      // Create ledger entry for wallet credit
      await this.context.sequelize.models.ledger.create({
        transactionId: transaction.id,
        walletId: wallet.id,
        balanceBefore: currentBalance,
        balanceAfter: newBalance
      })

      // Create redemption record with 'scanned' status (not pending for approval)
      const redemption = await this.context.sequelize.models.payoutQrCodeRedemption.create({
        qrCodeId: qrCode?.id,
        userId,
        status: 'scanned', // New status to indicate it was scanned but not redeemed
        redeemedAt: new Date()
      })

      this.log.info('QR Code Scanned Successfully', {
        message: 'QR code scanned and balance added to wallet successfully.',
        context: {
          qrCodeId: qrCode?.id,
          userId,
          redemptionId: redemption.id,
          amount: creditAmount,
          oldBalance: currentBalance,
          newBalance: newBalance
        }
      })

      return {
        success: true,
        qrCode: {
          id: qrCode.id,
          code: qrCode.code,
          amount: qrCode.amount
        },
        wallet: {
          id: wallet.id,
          balance: newBalance,
          currency: wallet.currency
        },
        transaction: {
          id: transaction.id,
          amount: creditAmount,
          type: 'credit',
          reference: transaction.reference
        },
        message: 'QR code scanned successfully! Amount has been added to your wallet.'
      }
    } catch (err) {
      this.log.error('QR Code Validation Failed', {
        message: err.message,
        context: { qrCodeId: this.args.qrCodeId, userId: this.args.userId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
