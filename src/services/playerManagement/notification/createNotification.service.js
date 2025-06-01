import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { uploadFile } from '@src/libs/s3'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import { emitNotification, emitUserNotification } from '@src/socket-resources/emitters/notification.emitter'
import { sendWebPushNotification } from '@src/libs/webPush.notification'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    title: { type: 'object' },
    description: { type: 'object' },
    notificationImage: { type: 'object' },
    url: { type: 'string' },
    userIds: { type: 'array' }
  },
  required: ['title', 'description']
})

export class CreateNotification extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { title, description, notificationImage, url, userIds } = this.args
      const transaction = this.context.sequelizeTransaction

      const result = await this.context.sequelize.models.notification.create({
        title: await getLanguageWiseNameJson(title),
        description: await getLanguageWiseNameJson(description),
        url,
        isPublicNotification: !userIds
      }, { transaction })

      if (notificationImage) {
        const fileLocation = await uploadFile(notificationImage.buffer, {
          name: result.id,
          mimetype: notificationImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.notifications
        })
        result.image = fileLocation
        await result.save({ transaction })
      }
      const payload = JSON.stringify({ title: title, body: description, icon: result.image, redirectUrl: url })

      if (userIds) {
        emitUserNotification(userIds, result)
        await this.context.sequelize.models.userNotification.bulkCreate(userIds.map(user => {
          return {
            userId: user,
            notificationId: result.id
          }
        }), { transaction })
        const notification = await this.context.sequelize.models.pushNotification.findAll({
          attributes: { exclude: ['createAt', 'updatedAt'] },
          where: { userId: userIds },
          transaction
        })
        if (notification.length > 0) await Promise.all(notification.map(subscription => sendWebPushNotification(subscription.endpoint, subscription.keys, payload)))
        return { status: true, message: 'Notification sent successfully', result }
      } else {
        emitNotification(result)
        const notification = await this.context.sequelize.models.pushNotification.findAll({
          attributes: { exclude: ['createAt', 'updatedAt'] },
          transaction
        })
        if (notification.length > 0) await Promise.all(notification.map(subscription => sendWebPushNotification(subscription.endpoint, subscription.keys, payload)))
        return { status: true, message: 'Notification sent to All successfully', result }
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      throw new APIError(error)
    }
  }
}
