import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phoneCode: { type: 'string' },
    phone: { type: 'string' }
  },
  required: ['userId']
})

export class UpdateUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { userId, firstName, lastName, email, phoneCode, phone } = this.args
      const { sequelize:{ models } } = this.context

      const user = await models.user.findOne({
        where: { id: userId }
      })
      if (!user) return this.addError('UserNotFoundErrorType', 'User not found')

      // Update the user fields
      if (firstName !== undefined) user.firstName = firstName
      if (lastName !== undefined) user.lastName = lastName
      if (email !== undefined) user.email = email
      if (phoneCode !== undefined) user.phoneCode = phoneCode
      if (phone !== undefined) user.phone = phone

      await user.save()

      return user
    } catch (err) {
      throw new APIError(err)
    }
  }
}
