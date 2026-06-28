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
  const { error } = await resend.emails.send({
    from: `${appConfig.resend.senderName} <${appConfig.resend.senderEmail}>`,
    to: [email],
    subject,
    html: htmlTemplate
  })

  if (error) throw new Error(error.message)

  return true
}
