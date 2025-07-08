import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { appConfig } from '@src/configs'
import axios from 'axios'

const createPayoutConstraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    contactId: { type: 'string' },
    fundAccountId: { type: 'string' },
    amount: { type: 'number', minimum: 1 },
    mode: { type: 'string', enum: ['IMPS', 'NEFT', 'RTGS'] },
    purpose: { type: 'string', maxLength: 100 },
    reference_id: { type: 'string', maxLength: 100 },
    narration: { type: 'string', maxLength: 100 }
  },
  required: ['userId', 'contactId', 'fundAccountId', 'amount']
})

export class CreatePayoutService extends ServiceBase {
  get constraints () {
    return createPayoutConstraints
  }

  async run () {
    try {
      const { userId, contactId, fundAccountId, ...payoutData } = this.args

      // Check if user exists and has the contactId
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId, contactId }
      })
      if (!user) {
        throw new APIError('User not found or contact not associated')
      }

      // Initialize RazorpayX API
      const razorpayXAuth = Buffer.from(`${appConfig.razorpayX.keyId}:${appConfig.razorpayX.keySecret}`).toString('base64')

      // Prepare payout data for RazorpayX
      const payoutRequestData = {
        account_number: appConfig.razorpayX.accountNumber,
        fund_account_id: fundAccountId,
        amount: payoutData.amount * 100, // Convert to paise
        currency: 'INR',
        mode: payoutData.mode || 'IMPS',
        purpose: payoutData.purpose || 'payout',
        reference_id: payoutData.reference_id || `payout_${userId}_${Date.now()}`,
        narration: payoutData.narration || 'Payout to user',
        queue_if_low_balance: true
      }

      // Create payout in RazorpayX
      const response = await axios.post('https://api.razorpay.com/v1/payouts', payoutRequestData, {
        headers: {
          Authorization: `Basic ${razorpayXAuth}`,
          'Content-Type': 'application/json'
        }
      })

      const payout = response.data

      this.log.info('RazorpayX Payout Created', {
        message: 'Payout initiated successfully',
        context: { userId, contactId, fundAccountId, payoutId: payout.id, amount: payoutData.amount }
      })

      return {
        payout,
        message: 'Payout initiated successfully'
      }
    } catch (err) {
      this.log.error('RazorpayX Payout Creation Failed', {
        message: err.message,
        context: { userId: this.args.userId, contactId: this.args.contactId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
