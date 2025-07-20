import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { appConfig } from '@src/configs'
import axios from 'axios'

const createContactConstraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    contact: { type: 'string', minLength: 10, maxLength: 15 },
    type: { type: 'string', enum: ['customer', 'employee'] },
    reference_id: { type: 'string', maxLength: 100 },
    notes: {
      type: 'object',
      properties: {
        notes_key_1: { type: 'string' },
        notes_key_2: { type: 'string' }
      }
    }
  },
  required: ['userId', 'name', 'contact']
})

export class CreateContactService extends ServiceBase {
  get constraints () {
    return createContactConstraints
  }

  async run () {
    try {
      const { userId, ...contactData } = this.args

      // Check if user exists
      const user = await this.context.sequelize.models.user.findByPk(userId)
      if (!user) {
        return this.addError('UserNotFoundErrorType', 'User not found')
      }

      // Check if user already has a contactId
      if (user.contactId) {
        return this.addError('ContactAlreadyExistsErrorType', 'User already has a Razorpay contact')
      }

      // Initialize RazorpayX API
      const razorpayXAuth = Buffer.from(`${appConfig.razorpayX.keyId}:${appConfig.razorpayX.keySecret}`).toString('base64')

      // Prepare contact data for RazorpayX
      const razorpayXContactData = {
        name: contactData.name,
        contact: contactData.contact || user.phone,
        type: contactData.type || 'customer',
        reference_id: contactData.reference_id || `user_${userId}`,
        notes: {
          ...contactData.notes,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      }

      // Create contact in RazorpayX
      const response = await axios.post('https://api.razorpay.com/v1/contacts', razorpayXContactData, {
        headers: {
          Authorization: `Basic ${razorpayXAuth}`,
          'Content-Type': 'application/json'
        }
      })

      const razorpayContact = response.data

      // Update user with contactId
      await user.update({ contactId: razorpayContact.id })

      this.log.info('Razorpay Contact Created', {
        message: 'Razorpay contact created successfully',
        context: { userId, contactId: razorpayContact.id }
      })

      return {
        contact: razorpayContact,
        user: {
          id: user.id,
          contactId: razorpayContact.id,
          name: user.firstName + ' ' + user.lastName
        },
        message: 'Razorpay contact created successfully'
      }
    } catch (err) {
      this.log.error('Razorpay Contact Creation Failed', {
        message: err.message,
        context: { userId: this.args.userId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
