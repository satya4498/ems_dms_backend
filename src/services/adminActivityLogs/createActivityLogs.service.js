import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    module: { type: 'string' },
    activity: { type: 'string' },
    adminId: { type: 'string' },
    recordId: { type: 'string' },
    fieldsAffected: { type: 'object', default: {} }
  },
  required: ['module', 'activity']
})

export class createActivityLogsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { args: { module, activity, adminId, recordId, fieldsAffected }, context: { sequelizeTransaction: transaction, models: { adminActivityLogs: adminActivityLogsModels } } } = this
    try {
      await adminActivityLogsModels.create({
        module,
        activity,
        adminId,
        recordId,
        fieldsAffected
      }, { transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
