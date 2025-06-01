import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { JoiningBonusService } from '@src/services/bonus/joiningBonus.service'
import { Logger } from '@src/libs/logger'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'number' },
    adminUserId: { type: 'string' }
  },
  required: ['userId', 'adminUserId']
})

export class VerifyEmailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    try {
      const user = await sequelize.models.user.findOne({
        where: { id: this.args.userId },
        attributes: ['id', 'email', 'emailVerified', 'username'],
        transaction
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')

      if (user.emailVerified) return this.addError('EmailAlreadyVerifiedErrorType')
      try{
        const {success,result,errors} = await JoiningBonusService.execute({
          userId: user.id,
          email: user.email,
          username: user.username,
          language: user.language?.code,
          adminUserId: this.args.adminUserId
        }, this.context)
        if(_.size(result?.errors)) throw new APIError(result?.errors)
      }catch(error){
        Logger.error(`Error IN BONUS USER_ID ${user.id}`, error)
      }
      

      await user.set({ emailVerified: true }).save({ transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
