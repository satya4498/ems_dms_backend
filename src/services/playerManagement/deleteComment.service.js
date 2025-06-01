import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    commentId: { type: 'string' }
  },
  required: ['commentId']
})

export class DeleteCommentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userComment = await this.context.sequelize.models.userComment.findOne({ where: { id: this.args.commentId } })
      if (!userComment) return this.addError('CommentDoesNotExistsErrorType')

      await userComment.destroy()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
