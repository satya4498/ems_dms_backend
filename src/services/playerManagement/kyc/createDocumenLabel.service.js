import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { populateDocumentLabelCache } from '@src/helpers/populateLocalCache.helper'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    required: { type: 'boolean', default: true }
  },
  required: ['name']
})

export class CreateDocumentLabelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const name = _.startCase(this.args.name)
    const required = this.args.required
    try {
      const [label, created] = await this.context.sequelize.models.documentLabel.findOrCreate({ defaults: { name, required }, where: { name } })
      if (!created) return this.addError('DocumentLabelExistsErrorType')
      await populateDocumentLabelCache()
      return { documentLabel: label }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
