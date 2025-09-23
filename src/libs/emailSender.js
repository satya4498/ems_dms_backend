import { appConfig } from '@src/configs'
import Mailjet from 'node-mailjet'

const mailjet = new Mailjet({
  apiKey: appConfig.mailjet.apiKey,
  apiSecret: appConfig.mailjet.secretKey,
  options: {
    timeout: 5000
  }
})

/**
 * @param {string} token
 * @param {string} email
 * @param {string} name
 * @returns {boolean}
 */
export async function sendEmail (email, name, subject, HTMLTemplate, attachment) {
  try {
    let Attachments
    if (attachment && attachment.contentType === 'text/csv') {
      const content = attachment?.content?.toString('base64')
      Attachments = [
        {
          ContentType: attachment.contentType,
          Filename: attachment.filename,
          Base64Content: content
        }
      ]
    }
    const response = await mailjet.post('send', { version: 'v3.1' }).request({
      messages: [{
        From: {
          Email: appConfig.mailjet.senderEmail,
          Name: appConfig.mailjet.senderName
        },
        To: [{
          Email: email,
          Name: name
        }],
        Subject: subject,
        HTMLPart: HTMLTemplate,
        Attachments: Attachments || []
      }]
    })

    return response.response.status === 200
  } catch (error) {
    throw Error(error)
  }
}
