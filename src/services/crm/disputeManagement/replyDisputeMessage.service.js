import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { emitDisputeMessage } from '@src/socket-resources/emitters/disputeManagement.emitter'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    userId: { type: 'string' },
    threadId: { type: 'string' },
    adminUserName: { type: 'string' },
    message: { type: 'string' },
    file: { type: 'object' }
  },
  required: ['adminUserId', 'message', 'threadId', 'userId']
})

export class ReplyDisputeMessageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      /** @type {Express.Multer.File} */
      const file = this.args.file
      const transaction = this.context.sequelizeTransaction
      const adminUserName = this.args.adminUserName

      const threadMessage = await this.context.sequelize.models.threadMessage.create({
        userId: this.args.userId,
        threadId: this.args.threadId,
        adminId: this.args.adminUserId,
        content: this.args.message,
        adminRead: true
      }, { transaction })

      if (file) {
        const fileLocation = await uploadFile(file.buffer, {
          name: String(this.args.threadId),
          mimetype: file.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.query
        })
        await this.context.sequelize.models.threadAttachement.create({
          messageId: threadMessage.id,
          filePath: fileLocation
        }, { transaction })
      }
	    threadMessage.dataValues.adminUserName = adminUserName
      emitDisputeMessage(this.args.userId, { threadMessage: threadMessage, adminUserName })
      return { threadMessage }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
