import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { appConfig } from '@src/configs/app.config'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import ajv from '@src/libs/ajv'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    token: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['token', 'password']
})

export class ResetPasswordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { token, password } = this.args

      let decoded
      try {
        decoded = Jwt.verify(token, appConfig.jwt.secret)
      } catch {
        return this.addError('InvalidTokenErrorType', 'Invalid or expired reset token')
      }

      if (decoded.type !== JWT_TOKEN_TYPES.FORGOT_PASSWORD) {
        return this.addError('InvalidTokenErrorType', 'Invalid or expired reset token')
      }

      const user = await this.context.sequelize.models.user.findOne({
        where: { id: decoded.userId }
      })
      if (!user) return this.addError('UserNotFoundErrorType', 'User not found')

      const hashedPassword = await bcrypt.hash(password, appConfig.bcrypt.salt)
      await user.update({ password: hashedPassword })

      return { message: 'Password reset successfully' }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
