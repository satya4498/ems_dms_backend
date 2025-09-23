// import { appConfig } from '@src/configs/app.config'
import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
// import twilio from 'twilio'
import { Cache } from '@src/libs/cache'
import { sendEmail } from '@src/libs/emailSender'

const sendOtpConstraints = ajv.compile({
  type: 'object',
  properties: {
    phoneNumber: { type: 'string', minLength: 10, maxLength: 15 },
    email: { type: 'string', format: 'email' }
  },
  required: ['email']
})

export class SendOtpService extends ServiceBase {
  get constraints () {
    return sendOtpConstraints
  }

  async run () {
    const { email } = this.args

    try {
      // const client = twilio(appConfig.twilio.accountSid, appConfig.twilio.authToken)
      // const response = await client.verify.v2.services(appConfig.twilio.serviceSid)
      //   .verifications
      //   .create({ to: phoneNumber, channel: 'sms' })
      const otp = Math.floor(100000 + Math.random() * 900000) // Generate a 6-digit OTP
      Cache.set(`otp:${email}`, { otp, attempts: 0, lastSent: new Date() }, 5 * 60) // Cache OTP for 5 minutes
      // const response = await client.messages.create({
      //   body: `Your OTP is ${otp}`,
      //   from: appConfig.twilio.phoneNumber,
      //   to: phoneNumber
      // })
      const HTMLTemplate = `<h3>Hello User,</h3><p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`
      const emailSent = await sendEmail(email, 'User', 'Jagadamba Hardware', HTMLTemplate)
      return {
        message: 'OTP sent successfully',
        status: emailSent.status,
        email,
        response: emailSent.response
      }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
