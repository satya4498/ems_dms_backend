import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { NumberPrecision } from '@src/libs/numberPrecision'

const approveRedemptionConstraints = ajv.compile({
  type: 'object',
  properties: {
    redemptionId: { type: 'string' },
    adminId: { type: 'string' },
    action: { type: 'string', enum: ['approve', 'reject'] },
    remarks: { type: 'string', maxLength: 500 }
  },
  required: ['redemptionId', 'adminId', 'action']
})

export class ApproveRedemptionService extends ServiceBase {
  get constraints () {
    return approveRedemptionConstraints
  }

  async run () {
    try {
      const { redemptionId, adminId, action, remarks } = this.args

      // Check if admin exists and has admin role
      const admin = await this.context.sequelize.models.user.findOne({
        where: { id: adminId, role: 'admin' }
      })
      if (!admin) {
        return this.addError('AdminUserNotFoundErrorType', 'Admin not found or insufficient permissions')
      }

      // Find the redemption request
      const redemption = await this.context.sequelize.models.payoutQrCodeRedemption.findOne({
        where: { id: redemptionId },
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

      if (!redemption) {
        return this.addError('RedemptionNotFoundErrorType', 'Redemption request not found')
      }

      if (redemption.status !== 'pending') {
        return this.addError('InvalidRedemptionStatusErrorType', 'Redemption request is not in pending status')
      }

      // Update redemption status
      const updateData = {
        status: action === 'approve' ? 'approved' : 'rejected',
        adminId,
        approvedAt: new Date(),
        remarks: remarks || null
      }

      await redemption.update(updateData)

      // If approved, process the payout
      let payoutDetails = null
      if (action === 'approve') {
        payoutDetails = await this.processPayout(redemption)
      }

      // Fetch updated redemption with details
      const updatedRedemption = await this.context.sequelize.models.payoutQrCodeRedemption.findOne({
        where: { id: redemptionId },
        include: [
          {
            model: this.context.sequelize.models.payoutQrCode,
            as: 'payoutQrCode'
          },
          {
            model: this.context.sequelize.models.user,
            as: 'user'
          },
          {
            model: this.context.sequelize.models.user,
            as: 'admin'
          }
        ]
      })

      this.log.info('Redemption Request Processed', {
        message: `Redemption request ${action}d successfully`,
        context: { redemptionId, adminId, action }
      })

      const response = {
        redemption: updatedRedemption,
        message: `Redemption request ${action}d successfully`
      }

      if (payoutDetails) {
        response.payoutDetails = payoutDetails
      }

      return response
    } catch (err) {
      this.log.error('Redemption Approval Failed', {
        message: err.message,
        context: { redemptionId: this.args.redemptionId, adminId: this.args.adminId },
        exception: err
      })
      throw new APIError(err)
    }
  }

  async processPayout (redemption) {
    const { payoutQrCode, user } = redemption

    // Get user's wallet
    const wallet = await this.context.sequelize.models.wallet.findOne({
      where: { userId: user.id },
      include: {
        model: this.context.sequelize.models.currency
      }
    })

    if (!wallet) {
      return this.addError('WalletNotFoundErrorType', 'User wallet not found')
    }

    // Check if user has sufficient balance
    if (wallet.balance < payoutQrCode.amount) {
      return this.addError('InsufficientBalanceErrorType', 'Insufficient wallet balance for payout')
    }

    // Check if user has contactId and fundAccountId for RazorpayX
    if (!user.contactId) {
      return this.addError('UserContactNotFoundErrorType', 'User contact not found. Please add contact first.')
    }

    if (!user.fundAccountId) {
      const fundAccounts = await this.getUserFundAccounts(user.contactId)
      if (fundAccounts.length === 0) {
        return this.addError('UserFundAccountNotFoundErrorType', 'No fund accounts found for user. Please add a fund account first.')
      }
      user.fundAccountId = fundAccounts[0].id // Use the first fund account
    }

    // Debit wallet first
    const currentBalance = wallet.balance
    const payoutAmount = payoutQrCode.amount
    const newBalance = NumberPrecision.minus(currentBalance, payoutAmount)

    // Update wallet balance
    await wallet.update({ balance: newBalance })

    // Create transaction record for wallet debit
    const debitTransaction = await this.context.sequelize.models.transaction.create({
      walletId: wallet.id,
      amount: payoutAmount,
      type: 'debit',
      reference: `PAYOUT_${redemption.id}`
    })

    // Create ledger entry for wallet debit
    await this.context.sequelize.models.ledger.create({
      transactionId: debitTransaction.id,
      walletId: wallet.id,
      balanceBefore: currentBalance,
      balanceAfter: newBalance
    })

    // Initiate RazorpayX payout
    const payoutResponse = await this.createRazorpayXPayout(user.contactId, user.fundAccountId, payoutAmount)

    this.log.info('Payout Processed', {
      message: 'Wallet debited and RazorpayX payout initiated successfully',
      context: {
        userId: user.id,
        amount: payoutAmount,
        oldBalance: currentBalance,
        newBalance: newBalance,
        redemptionId: redemption.id,
        payoutId: payoutResponse.id
      }
    })

    return {
      walletDebit: {
        transactionId: debitTransaction.id,
        amount: payoutAmount,
        oldBalance: currentBalance,
        newBalance: newBalance
      },
      razorpayPayout: payoutResponse
    }
  }

  async getUserFundAccounts (contactId) {
    const { appConfig } = await import('@src/configs')
    const axios = await import('axios')

    const razorpayXAuth = Buffer.from(`${appConfig.razorpayX.keyId}:${appConfig.razorpayX.keySecret}`).toString('base64')

    const response = await axios.default.get(`https://api.razorpay.com/v1/fund_accounts?contact_id=${contactId}`, {
      headers: {
        Authorization: `Basic ${razorpayXAuth}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  }

  async createRazorpayXPayout (contactId, fundAccountId, amount) {
    const { appConfig } = await import('@src/configs')
    const axios = await import('axios')

    const razorpayXAuth = Buffer.from(`${appConfig.razorpayX.keyId}:${appConfig.razorpayX.keySecret}`).toString('base64')

    const payoutData = {
      account_number: appConfig.razorpayX.accountNumber,
      fund_account_id: fundAccountId,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      mode: 'IMPS',
      purpose: 'payout',
      reference_id: `payout_${Date.now()}`,
      narration: 'QR Code redemption payout',
      queue_if_low_balance: true
    }

    const response = await axios.default.post('https://api.razorpay.com/v1/payouts', payoutData, {
      headers: {
        Authorization: `Basic ${razorpayXAuth}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  }
}
