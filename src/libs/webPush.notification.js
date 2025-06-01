
import { appConfig } from '@src/configs'
import webPush from 'web-push'

webPush.setVapidDetails(
  appConfig.pushNotificationKeys.subject,
  appConfig.pushNotificationKeys.publicKey,
  appConfig.pushNotificationKeys.privateKey
)

/**
 *
 * @param {String} endpoint
 * @param {String} keys
 * @param {Object} payload
 */
export async function sendWebPushNotification (endpoint, keys, payload) {
  webPush.sendNotification({ endpoint, keys }, payload)
}
