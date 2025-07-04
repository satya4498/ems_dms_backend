import { ServiceBase } from '@src/libs/serviceBase'

export class ApprovePayoutService extends ServiceBase {
  async run () {
    const { redeemRequestId, adminId, remarks } = this.args
    if (!redeemRequestId || !adminId) {
      return this.addError('Input', 'redeemRequestId and adminId are required')
    }

    const { redeemRequest, wallet, ledger } = this.context.models
    const transaction = await this.context.sequelize.transaction()
    try {
      const request = await redeemRequest.findByPk(redeemRequestId, { transaction })
      if (!request || request.status !== 'PENDING') {
        await transaction.rollback()
        return this.addError('Request', 'not found or not pending')
      }
      // Check user wallet
      const userWallet = await wallet.findOne({ where: { userId: request.userId }, transaction })
      if (!userWallet || userWallet.balance < request.amount) {
        await transaction.rollback()
        return this.addError('Wallet', 'insufficient balance')
      }
      // Deduct from wallet
      userWallet.balance -= request.amount
      await userWallet.save({ transaction })
      // Add ledger entry
      await ledger.create({
        userId: request.userId,
        type: 'DEBIT',
        amount: request.amount,
        purpose: 'REDEEM',
        transactionId: request.id
      }, { transaction })
      // Update redeem request
      request.status = 'APPROVED'
      request.processed_at = new Date()
      request.admin_id = adminId
      request.remarks = remarks
      await request.save({ transaction })
      await transaction.commit()
      return { success: true, message: 'Redeem request approved' }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
