import { ServiceBase } from '@src/libs/serviceBase'

import ajv from '@src/libs/ajv'
const payload = ajv.compile({
  type: 'object',
  properties: {
    payoutQrCodeId: { type: 'number' }
  },
  required: ['payoutQrCodeId']
})

export class DeletePayoutService extends ServiceBase {
  get constraints () {
    return payload
  }

  async run () {
    const { payoutQrCodeId } = this.args
    if (!payoutQrCodeId) {
      return this.addError('payoutQrCodeId', 'is required')
    }
    const transaction = await this.context.models.sequelize.transaction()
    try {
      // Delete related redemptions first
      await this.context.models.payoutQrCodeRedemption.destroy({
        where: { qrCodeId: payoutQrCodeId },
        transaction
      })
      // Delete the payout QR code
      const deleted = await this.context.models.payoutQrCode.destroy({
        where: { id: payoutQrCodeId },
        transaction
      })
      await transaction.commit()
      if (deleted === 0) {
        return this.addError('Payout', 'QR code not found')
      }
      return { success: true, message: 'Payout QR code deleted successfully' }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
