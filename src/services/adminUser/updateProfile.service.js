import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    firstName: { type: 'string', maxLength: 50, minLength: 3, pattern: '^[a-zA-Z]*$' },
    lastName: { type: 'string', maxLength: 50, pattern: '^[a-zA-Z]*$' },
    email: { type: 'string', maxLength: 150, format: 'email' },
    username: { type: 'string', maxLength: 100, pattern: '^[A-Za-z][A-Za-z0-9_]{3,50}$' }
  },
  required: ['adminUserId']
})

export class UpdateProfileService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const email = this.args.email
    const lastName = this.args.lastName
    const username = this.args.username
    const firstName = this.args.firstName

    try {
      const adminUser = await this.context.sequelize.models.adminUser.findOne({ where: { id: this.args.adminUserId } })
      if (!adminUser) return this.addError('UserNotFoundErrorType')

      if (lastName) adminUser.lastName = lastName
      if (username) adminUser.username = username
      if (firstName) adminUser.firstName = firstName
      if (email) {
        // TODO: Send confirmation email
        adminUser.email = email
      }

      await adminUser.save()

      return { adminUser }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
