import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
/**
 * get all logs
 */

export class GetActivityLogsService extends ServiceBase {
  async run () {
    const {
      args: { page = 1, perPage = 10 },
      context: { models: { adminActivityLogs: adminActivityLogsModels, adminUser: adminUserModel } }
    } = this

    try {
      const logs = await adminActivityLogsModels.findAll({
        attributes: { exclude: ['type', 'updatedAt'] },
        include: {
          model: adminUserModel,
          attributes: ['id', 'firstName', 'lastName', 'email', 'username']
        },
        limit: perPage,
        offset: (page - 1) * perPage
      })

      // count the banners
      const logsCount = await adminActivityLogsModels.count({
        attributes: { exclude: ['type', 'updatedAt'] }
      })

      return { logs, totalPages: Math.ceil(logsCount / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
