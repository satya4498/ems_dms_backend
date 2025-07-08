import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { appConfig } from '@src/configs'
import axios from 'axios'

const getContactConstraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    contactId: { type: 'string' }
  },
  required: ['userId', 'contactId']
})

export class GetContactService extends ServiceBase {
  get constraints () {
    return getContactConstraints
  }

  async run () {
    try {
      const { userId, contactId } = this.args

      // Check if user exists and has the contactId
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId, contactId }
      })
      if (!user) {
        throw new APIError('User not found or contact not associated')
      }

      // Initialize RazorpayX API
      const razorpayXAuth = Buffer.from(`${appConfig.razorpayX.keyId}:${appConfig.razorpayX.keySecret}`).toString('base64')

      // Get contact details
      const contactResponse = await axios.get(`https://api.razorpay.com/v1/contacts/${contactId}`, {
        headers: {
          Authorization: `Basic ${razorpayXAuth}`,
          'Content-Type': 'application/json'
        }
      })

      const contact = contactResponse.data

      // Get fund accounts for this contact
      const fundAccountsResponse = await axios.get(`https://api.razorpay.com/v1/fund_accounts?contact_id=${contactId}`, {
        headers: {
          Authorization: `Basic ${razorpayXAuth}`,
          'Content-Type': 'application/json'
        }
      })

      const fundAccounts = fundAccountsResponse.data.items

      this.log.info('Contact Details Retrieved', {
        message: 'Razorpay contact details retrieved successfully',
        context: { userId, contactId }
      })

      return {
        contact,
        fundAccounts: fundAccounts.items,
        user: {
          id: user.id,
          contactId: user.contactId,
          name: user.firstName + ' ' + user.lastName
        }
      }
    } catch (err) {
      this.log.error('Contact Retrieval Failed', {
        message: err.message,
        context: { userId: this.args.userId, contactId: this.args.contactId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
