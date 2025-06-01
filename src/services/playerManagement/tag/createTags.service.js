import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tag: { type: 'string' },
    isActive : { type: 'boolean' },
  },
  required: ['tag']
})

export class CreateTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const tag = this.args.tag
    const isActive = this.args.hasOwnProperty('isActive') ? this.args.isActive : true

    try {
      const tagName = await this.context.sequelize.models.tag.findOne({ where: { tag: { [Op.iLike]:tag } } })
      if (tagName) return this.addError('TagAlreadyExistErrorType')

      const newTag = await this.context.sequelize.models.tag.create({ tag , isActive })
      return { tag: newTag }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
