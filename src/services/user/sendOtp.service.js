import { appConfig } from '@src/configs/app.config'
import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import twilio from 'twilio'
import { Cache } from '@src/libs/cache'
const sendOtpConstraints = ajv.compile({
  type: 'object',
  properties: {
    phoneNumber: { type: 'string', minLength: 10, maxLength: 15 }
  },
  required: ['phoneNumber']
})

export class SendOtpService extends ServiceBase {
  get constraints () {
    return sendOtpConstraints
  }

  async run () {
    const { phoneNumber } = this.args

    try {
      const client = twilio(appConfig.twilio.accountSid, appConfig.twilio.authToken)
      // const response = await client.verify.v2.services(appConfig.twilio.serviceSid)
      //   .verifications
      //   .create({ to: phoneNumber, channel: 'sms' })
      const otp = Math.floor(100000 + Math.random() * 900000) // Generate a 6-digit OTP
      Cache.set(`otp:${phoneNumber}`, { otp, attempts: 0, lastSent: new Date() }, 5 * 60) // Cache OTP for 5 minutes
      const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: appConfig.twilio.phoneNumber,
        to: phoneNumber
      })

      return {
        message: 'OTP sent successfully',
        status: response.status,
        phoneNumber,
        response
      }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
