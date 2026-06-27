import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    isActive: { type: 'boolean' }
  },
  required: ['userId']
})

export class ToggleUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { userId, isActive } = this.args
      const { sequelize:{ models } } = this.context

      const user = await models.user.findOne({
        where: { id: userId }
      })
      if (!user) return this.addError('UserNotFoundErrorType', 'User not found')

      if (isActive !== undefined) user.isActive = isActive

      await user.save()

      return user
    } catch (err) {
      throw new APIError(err)
    }
  }
}
