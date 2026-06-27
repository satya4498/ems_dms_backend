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
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    phone: { type: 'string' },
    phoneCode: { type: 'string' }
  },
  required: ['email', 'password']
})

export class SignUpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { firstName, lastName, email, password, phone, phoneCode } = this.args

      const existingUser = await this.context.sequelize.models.user.findOne({
        where: { email }
      })
      if (existingUser) return this.addError('EmailAlreadyExistsErrorType', 'Email already exists')

      if (phone) {
        const existingPhone = await this.context.sequelize.models.user.findOne({
          where: { phone }
        })
        if (existingPhone) return this.addError('PhoneAlreadyExistsErrorType', 'Phone already exists')
      }

      const hashedPassword = await bcrypt.hash(password, appConfig.bcrypt.salt)

      const user = await this.context.sequelize.models.user.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || null,
        phoneCode: phoneCode || null
      })

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
        phoneCode: user.phoneCode,
        isNewUser: true,
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
