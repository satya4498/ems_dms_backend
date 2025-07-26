import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { AddBankAccountService } from '@src/services/razorpay/addBankAccount.service'

const redeemQrCodeConstraints = ajv.compile({
  type: 'object',
  properties: {
    qrCodeId: { type: 'string' },
    userId: { type: 'string' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    ifsc: { type: 'string', minLength: 11, maxLength: 11 },
    accountNumber: { type: 'string', minLength: 9, maxLength: 18 }
  },
  required: ['qrCodeId', 'userId']
})

export class RedeemQrCodeService extends ServiceBase {
  get constraints () {
    return redeemQrCodeConstraints
  }

  async run () {
    try {
      const { qrCodeId, userId, name, ifsc, accountNumber } = this.args

      // Check if user exists
      const user = await this.context.sequelize.models.user.findByPk(userId)
      if (!user) {
        return this.addError('UserNotFoundErrorType', 'User not found')
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

      // Check if QR code exists and is valid
      const qrCode = await this.context.sequelize.models.payoutQrCode.findByPk(qrCodeId)
      if (!qrCode) {
        return this.addError('QrCodeNotFoundErrorType', 'QR code not found')
      }

      // Check if user has already redeemed this QR code
      const existingRedemption = await this.context.sequelize.models.payoutQrCodeRedemption.findOne({
        where: {
          qrCodeId,
          userId
        }
      })

      if (existingRedemption) {
        return { success: false, message: `This QR code has already redeemed by ${user?.firstNme}`, redemption: qrCodeId }
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

      // Create redemption request with pending status
      const redemption = await this.context.sequelize.models.payoutQrCodeRedemption.create({
        qrCodeId,
        userId,
        status: 'pending',
        redeemedAt: new Date()
      })

      // Fetch the created redemption with related data
      const redemptionWithDetails = await this.context.sequelize.models.payoutQrCodeRedemption.findOne({
        where: { id: redemption.id },
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
        message: 'QR code scanned and balance added to wallet. Redemption request created successfully.',
        context: {
          qrCodeId,
          userId,
          redemptionId: redemption.id,
          amount: creditAmount,
          oldBalance: currentBalance,
          newBalance: newBalance
        }
      })

      return {
        redemption: redemptionWithDetails,
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
        message: 'QR code scanned successfully! Balance added to wallet. Payout request submitted for admin approval.'
      }
    } catch (err) {
      this.log.error('QR Code Redemption Failed', {
        message: err.message,
        context: { qrCodeId: this.args.qrCodeId, userId: this.args.userId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
