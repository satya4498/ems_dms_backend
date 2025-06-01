import { decorateResponse } from '@src/helpers/response.helpers'
import { GetActivityLogsService } from '@src/services/adminActivityLogs/getActivityLogs.service'

export class AdminActivityLogsController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getActivityLogs (req, res, next) {
    try {
      const result = await GetActivityLogsService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
