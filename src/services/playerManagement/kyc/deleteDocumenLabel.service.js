import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { deleteFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    documentLabelId: { type: 'string' }
  },
  required: ['documentLabelId']
})

export class DeleteDocumentLabelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const label = await this.context.sequelize.models.documentLabel.findOne({
        where: { id: this.args.documentLabelId },
        include: {
          model: this.context.models.document,
          attributes: ['url']
        }
      })
      if (!label) return this.addError('DocumentLabelDoesNotExistsErrorType')
      const userDocuments = label.documents || []

      await Promise.all(userDocuments.map(document => {
        if (document.url) return deleteFile(document.url, S3FolderHierarchy.user)
        return Promise.resolve() // Explicitly return a Promise that resolves to undefined
      }))

      await label.destroy()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
