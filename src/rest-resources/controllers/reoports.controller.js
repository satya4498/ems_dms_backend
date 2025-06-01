import { configureCsvFile } from '@src/helpers/common.helper'
import { decorateResponse } from '@src/helpers/response.helpers'
import { ReportService } from '@src/services/report/reports.service'

export class ReportsController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getReport (req, res, next) {
    try {
      const result = await ReportService.execute(req.query, req.context)
      if (req?.query?.csvDownload) return configureCsvFile(result.result.file, result.result.data, res)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async exportReport (req, res, next) {
    try {
      const result = await ReportService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
