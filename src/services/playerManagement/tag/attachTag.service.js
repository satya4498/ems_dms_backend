import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tagId: { type: 'string' },
    userIds: { type: 'array' }
  },
  required: ['tagId', 'userIds']
})

export class AttachTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const tagId = this.args.tagId
    const userIds = this.args.userIds

    try {
      const tag = await this.context.sequelize.models.tag.findOne({
        where: { id: tagId, isActive: true }
      })

      if (!tag) return this.addError('TagIsNotAttachedErrorType')

      if (userIds.length > 0) {
        const newUserTags = userIds.map(userId => ({ userId, tagId }))
        await this.context.sequelize.models.userTag.bulkCreate(newUserTags, { updateOnDuplicate: ['updatedAt'] })
      }

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
