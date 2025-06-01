import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tagId: { type: 'string' },
    name: { type: 'string' },
    isActive: { type: 'boolean' }
  },
  required: ['tagId']
})

export class UpdateTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { name, isActive } = this.args
      const tag = await this.context.sequelize.models.tag.findOne({ where: { id: this.args.tagId } })
      if (!tag) return this.addError('InvalidIdErrorType')
      const tagName = await this.context.sequelize.models.tag.findOne({ where: { tag: { [Op.iLike]:name }, id: { [Op.ne]: this.args.tagId } } })
      if (tagName) return this.addError('TagAlreadyExistErrorType')

      if (name) tag.tag = name
      if (isActive === true || isActive === false) tag.isActive = isActive
      await tag.save()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
