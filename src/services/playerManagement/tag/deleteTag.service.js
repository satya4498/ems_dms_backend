import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tagId: { type: 'string' }
  },
  required: ['tagId']
})

export class DeleteTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const tag = await this.context.sequelize.models.tag.findOne({ where: { id: this.args.tagId } })
      if (!tag) return this.addError('InvalidIdErrorType')

      await tag.destroy()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
