import { decorateResponse } from '@src/helpers/response.helpers'
import { GetStatsSummaryService } from '@src/services/dashboard/getStatsSummary.service'
import { GetDemographService } from '@src/services/dashboard/getDemograph.service'
import { GetGameReportService } from '@src/services/dashboard/getGameReport.service'
import { GetKpiSummaryService } from '@src/services/dashboard/getKpiSummary.service'
import { GetLivePlayerDetailsService, GetMatricsService } from '@src/services/dashboard/getLivePlayerDetails.service'
import { GetPlayerPerformanceReportService } from '@src/services/dashboard/playerStatsReport.service'

export default class DashboardController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getMatrics (req, res, next) {
    try {
      const result = await GetMatricsService.execute(req.query, req.context)
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
  static async getDemograph (req, res, next) {
    try {
      const result = await GetDemographService.execute(req.query, req.context)
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
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
  static async getGameReport (req, res, next) {
    try {
      const result = await GetGameReportService.execute(req.query, req.context)
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
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
  static async getKipSummary (req, res, next) {
    try {
      const result = await GetKpiSummaryService.execute(req.query, req.context)
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
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
  static async getPlayerPerformanceReport (req, res, next) {
    try {
      const result = await GetPlayerPerformanceReportService.execute(req.query, req.context)
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
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
  static async getStatsSummary (req, res, next) {
    try {
      const result = await GetStatsSummaryService.execute(req.query, req.context)
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
