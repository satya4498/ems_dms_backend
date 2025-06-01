import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { populateDocumentLabelCache } from '@src/helpers/populateLocalCache.helper'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    documentLabelId: { type: 'string' },
    required: { type: 'boolean' }
  },
  required: ['name', 'required']
})

export class UpdateDocumentLabelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const name = _.startCase(this.args.name)
    const required = this.args.required
    const documentLabelId = this.args.documentLabelId

    try {
      const label = await this.context.sequelize.models.documentLabel.findOne({ where: { id: documentLabelId }})

      if (!label) return this.addError('DocumentLabelDoesNotExistsErrorType')
      label.name = name
      label.required = required
      await label.save()

      await populateDocumentLabelCache()
      return { documentLabel: label }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
