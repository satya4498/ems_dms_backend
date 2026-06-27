import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { Cache } from '@src/libs/cache'
import { sendEmailViaResend } from '@src/libs/resendEmailSender'
import ajv from '@src/libs/ajv'

const OTP_TTL_SECONDS = 600 // 10 minutes

const constraints = ajv.compile({
  type: 'object',
  properties: {
    email: { type: 'string' }
  },
  required: ['email']
})

export class SendEmailOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { email } = this.args

      const user = await this.context.sequelize.models.user.findOne({
        where: { email }
      })
      if (!user) return this.addError('UserNotFoundErrorType', 'User not found')

      if (user.emailVerified) return this.addError('EmailAlreadyVerifiedErrorType', 'Email is already verified')

      const otp = String(Math.floor(100000 + Math.random() * 900000))

      await Cache.set(`email-otp:${email}`, { otp }, OTP_TTL_SECONDS)

      const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Hi ${user.firstName || user.email},</p>
          <p>Use the OTP below to verify your email address.</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:16px 24px;background:#f4f4f5;border-radius:8px;display:inline-block;margin:16px 0;">
            ${otp}
          </div>
          <p>This OTP expires in <strong>10 minutes</strong>.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `

      await sendEmailViaResend(email, user.firstName || email, 'Verify Your Email - OTP', htmlTemplate)

      return { message: 'OTP sent to your email' }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
