import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { appConfig } from '@src/configs'
import axios from 'axios'

const addBankAccountConstraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    contactId: { type: 'string' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    ifsc: { type: 'string', minLength: 11, maxLength: 11 },
    accountNumber: { type: 'string', minLength: 9, maxLength: 18 }
  },
  required: ['userId', 'contactId', 'name', 'ifsc', 'accountNumber']
})

export class AddBankAccountService extends ServiceBase {
  get constraints () {
    return addBankAccountConstraints
  }

  async run () {
    try {
      const { userId, contactId, ...bankData } = this.args

      // Check if user exists and has the contactId
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId, contactId }
      })
      if (!user) {
        return this.addError('UserNotFoundErrorType', 'User not found or contact not associated')
      }

      // Initialize RazorpayX API
      const razorpayXAuth = Buffer.from(`${appConfig.razorpayX.keyId}:${appConfig.razorpayX.keySecret}`).toString('base64')

      // Add bank account to contact
      const fundAccountData = {
        contact_id: contactId,
        account_type: 'bank_account',
        bank_account: {
          name: bankData.name,
          ifsc: bankData.ifsc,
          account_number: bankData.accountNumber
        }
      }

      const response = await axios.post('https://api.razorpay.com/v1/fund_accounts', fundAccountData, {
        headers: {
          Authorization: `Basic ${razorpayXAuth}`,
          'Content-Type': 'application/json'
        }
      })

      const bankAccount = response.data

      // Update user with fundAccountId
      await user.update({ fundAccountId: bankAccount.id })

      this.log.info('Bank Account Added', {
        message: 'Bank account added to Razorpay contact successfully',
        context: { userId, contactId, fundAccountId: bankAccount.id }
      })

      return {
        fundAccount: bankAccount,
        message: 'Bank account added successfully'
      }
    } catch (err) {
      this.log.error('Bank Account Addition Failed', {
        message: err.message,
        context: { userId: this.args.userId, contactId: this.args.contactId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
