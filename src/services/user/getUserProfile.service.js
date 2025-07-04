// import { appConfig } from '@src/configs/app.config'
import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class GetUserProfileService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userId = this.args.userId
      if (!userId) throw new APIError('User not authenticated')

      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId },
        include: {
          model: this.context.sequelize.models.wallet,
          include: {
            model: this.context.sequelize.models.currency
          }
        }
      })
      if (!user) throw new APIError('User not found')

      return { user }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
