import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { Cache } from '@src/libs/cache'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    email: { type: 'string' },
    otp: { type: 'string' }
  },
  required: ['email', 'otp']
})

export class VerifyEmailOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { email, otp } = this.args

      const user = await this.context.sequelize.models.user.findOne({
        where: { email }
      })
      if (!user) return this.addError('UserNotFoundErrorType', 'User not found')

      if (user.emailVerified) return this.addError('EmailAlreadyVerifiedErrorType', 'Email is already verified')

      const cached = await Cache.get(`email-otp:${email}`)
      if (!cached || !cached.otp) return this.addError('InvalidTokenErrorType', 'OTP expired or not found')

      if (cached.otp !== otp) return this.addError('InvalidTokenErrorType', 'Invalid OTP')

      await user.update({ emailVerified: true })
      await Cache.del(`email-otp:${email}`)

      return { message: 'Email verified successfully' }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
