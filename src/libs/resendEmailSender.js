import { appConfig } from '@src/configs'
import { Resend } from 'resend'

const resend = new Resend(appConfig.resend.apiKey)

/**
 * @param {string} email
 * @param {string} name
 * @param {string} subject
 * @param {string} htmlTemplate
 * @returns {Promise<boolean>}
 */
export async function sendEmailViaResend (email, name, subject, htmlTemplate) {
  const isDev = appConfig.env === 'development'
  const toEmail = isDev ? 'freelancer.8510@gmail.com' : email

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [toEmail],
    subject,
    html: htmlTemplate
  })

  if (error) throw new Error(error.message)

  return true
}
