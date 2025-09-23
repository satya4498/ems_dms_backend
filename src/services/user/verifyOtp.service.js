import { appConfig } from '@src/configs/app.config'
import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
// import twilio from 'twilio'
import jwt from 'jsonwebtoken'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import { Cache } from '@src/libs/cache'

const verifyOtpConstraints = ajv.compile({
  type: 'object',
  properties: {
    phoneNumber: { type: 'string', minLength: 10, maxLength: 15 },
    otp: { type: 'string', minLength: 4, maxLength: 10 },
    email: { type: 'string', format: 'email' },
    sId: { type: 'string' }
  },
  required: ['otp', 'email']
})

export class VerifyOtpService extends ServiceBase {
  get constraints () {
    return verifyOtpConstraints
  }

  async run () {
    const { email, otp } = this.args

    try {
      // const client = twilio(appConfig.twilio.accountSid, appConfig.twilio.authToken)
      // const response = await client.verify.v2.services(appConfig.twilio.serviceSid)
      //   .verificationChecks
      //   .create({ code: otp, verificationSid: sId })
      const cachedOtpData = await Cache.get(`otp:${email}`)
      if (cachedOtpData.otp === Number(otp)) {
        // Find or create user
        let isNewUser = false
        // const phoneCode = phoneNumber.split('+91')[0]
        // const phoneNumberWithoutCode = phoneNumber.split('+91')[1]
        let user = await this.context.sequelize.models.user.findOne({ where: { email } })
        if (!user) {
          user = await this.context.sequelize.models.user.create({
            email
          })

          // Create wallet for the user in default currency
          const currencyModel = this.context.sequelize.models.currency
          const defaultCurrency = await currencyModel.findOne({ where: { isActive: true }, order: [['id', 'ASC']] })
          if (defaultCurrency) {
            await this.context.sequelize.models.wallet.create({
              userId: user.id,
              currencyId: defaultCurrency.id,
              balance: 0
            })
          }
          isNewUser = true
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role, isNewUser, type: JWT_TOKEN_TYPES.LOGIN },
          appConfig.jwt.secret,
          { expiresIn: appConfig.jwt.expiry }
        )

        return { success: true, message: 'OTP verified', token, user, isNewUser }
      } else {
        return { success: false, message: 'Invalid OTP' }
      }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
