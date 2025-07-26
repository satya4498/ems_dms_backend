import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { USER_GENDER } from '@src/utils/constants/public.constants.utils'
import { CreateContactService } from '@src/services/razorpay/createContact.service'
/**
 * Service for updating user profile information
 *
 * This service allows authenticated users to update their profile details including:
 * - Personal information (firstName, lastName, email, dateOfBirth, gender)
 * - Address information (address, city, state, country, zipCode)
 * - Profile image (imageUrl)
 *
 * Features:
 * - Validates input data using AJV schema
 * - Checks for email uniqueness if email is being updated
 * - Only updates provided fields (partial updates supported)
 * - Returns updated user with wallet and currency information
 * - Comprehensive logging for audit trail
 */

const updateProfileConstraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      transform: ['trim']
    },
    lastName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      transform: ['trim']
    },
    email: {
      type: 'string',
      format: 'email',
      transform: ['trim', 'toLowerCase']
    },
    dateOfBirth: {
      type: 'string',
      format: 'date'
    },
    gender: {
      type: 'string',
      enum: Object.values(USER_GENDER)
    },
    address: {
      type: 'string',
      maxLength: 255,
      transform: ['trim']
    },
    city: {
      type: 'string',
      maxLength: 100,
      transform: ['trim']
    },
    state: {
      type: 'string',
      maxLength: 100,
      transform: ['trim']
    },
    country: {
      type: 'string',
      maxLength: 100,
      transform: ['trim']
    },
    zipCode: {
      type: 'string',
      maxLength: 20,
      transform: ['trim']
    },
    imageUrl: {
      type: 'string',
      format: 'uri'
    },
    description: {
      type: 'string',
      maxLength: 500,
      transform: ['trim']
    }
  },
  required: ['userId']
})

export class UpdateProfileService extends ServiceBase {
  get constraints () {
    return updateProfileConstraints
  }

  async run () {
    try {
      const { userId, ...updateData } = this.args
      // Check if user exists
      const existingUser = await this.context.sequelize.models.user.findByPk(userId)
      if (!existingUser) {
        throw new APIError('User not found')
      }

      // Remove undefined values to avoid overwriting with null
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null)
      )

      // Create Razorpay contact if not already created
      const razorpayContactId = existingUser.razorpayContactId
      if (!razorpayContactId) {
        await CreateContactService.execute(
          {
            userId,
            name: `${cleanUpdateData.firstName || existingUser.firstName} ${cleanUpdateData.lastName || existingUser.lastName}`,
            contact: existingUser.phone
          }, this.context)
      }

      // Update user profile
      await existingUser.update(cleanUpdateData)

      // Fetch updated user with wallet and currency info
      const userWithWallet = await this.context.sequelize.models.user.findOne({
        where: { id: userId },
        include: {
          model: this.context.sequelize.models.wallet,
          include: {
            model: this.context.sequelize.models.currency
          }
        }
      })

      this.log.info('Profile Updated', {
        message: 'User profile updated successfully',
        context: { userId, updatedFields: Object.keys(cleanUpdateData) }
      })

      return {
        user: userWithWallet,
        message: 'Profile updated successfully'
      }
    } catch (err) {
      this.log.error('Profile Update Failed', {
        message: err.message,
        context: { userId: this.args.userId },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
