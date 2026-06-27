import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { appConfig } from '@src/configs/app.config'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import { sendEmail } from '@src/libs/emailSender'
import { sendEmailViaResend } from '@src/libs/resendEmailSender'
import ajv from '@src/libs/ajv'
import Jwt from 'jsonwebtoken'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    email: { type: 'string' }
  },
  required: ['email']
})

export class ForgotPasswordService extends ServiceBase {
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

      const resetToken = Jwt.sign(
        { userId: user.id, email: user.email, type: JWT_TOKEN_TYPES.FORGOT_PASSWORD },
        appConfig.jwt.secret,
        { expiresIn: '30m' }
      )

      const resetLink = `${appConfig.userFrontend.endpoint}/reset-password?token=${resetToken}`

      const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>Hi ${user.firstName || user.email},</p>
          <p>We received a request to reset your password. Click the button below to proceed.</p>
          <p>This link expires in <strong>30 minutes</strong>.</p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">
            Reset Password
          </a>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `

      const isDev = appConfig.env === 'development'

      if (isDev) {
        await sendEmailViaResend(user.email, user.firstName || user.email, 'Reset Your Password', htmlTemplate)
      } else {
        await sendEmail(user.email, user.firstName || user.email, 'Reset Your Password', htmlTemplate)
      }

      return {
        message: 'Password reset link sent to your email',
        ...(isDev && { resetToken })
      }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
