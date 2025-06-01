import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    threadId: { type: 'string' }
  },
  required: ['threadId']
})

export class GetThreadDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { threadId } = this.args
      const threadMessages = await this.context.sequelize.models.mainThread.findOne({
        where: { id: threadId },
        include: [{
          model: this.context.sequelize.models.threadMessage,
          separate: true,
	  order: [['createdAt', 'ASC']],
          include: [{
            model: this.context.sequelize.models.threadAttachement
          }, {
            model: this.context.sequelize.models.user,
            attributes: ['id', 'username', 'email']

          }]
        }]
      })
      await this.context.sequelize.models.threadMessage.update({ adminRead: true }, { where: { threadId } })
      return { threadMessages }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
