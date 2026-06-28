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
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password']
})

export class SignInService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { email, password } = this.args

      const user = await this.context.sequelize.models.user.findOne({
        where: { email }
      })
      if (!user) return this.addError('UserNotFoundErrorType', 'User not found')

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) return this.addError('InvalidPasswordErrorType', 'Invalid password')

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
        phoneCode: user.phoneCode,
        isNewUser: false,
        type: JWT_TOKEN_TYPES.LOGIN
      }

      const accessToken = Jwt.sign(tokenPayload, appConfig.jwt.secret, {
        expiresIn: appConfig.jwt.expiry
      })

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          phoneCode: user.phoneCode,
          role: user.role
        },
        accessToken
      }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
