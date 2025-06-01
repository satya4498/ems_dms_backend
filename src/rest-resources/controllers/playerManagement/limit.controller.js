import { decorateResponse } from '@src/helpers/response.helpers'
import { UpdateBettingLimitsService } from '@src/services/playerManagement/limits/updateBettingLimits.service'
import { UpdateDepositAndLossLimitsService } from '@src/services/playerManagement/limits/updateDepositAndLossLimits.service'
import { UpdateSelfExclusionService } from '@src/services/playerManagement/limits/updateSelfExclusion.service'
import { UpdateSessionLimitService } from '@src/services/playerManagement/limits/updateSessionLimit.service'

export class LimitController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updateBettingLimits (req, res, next) {
    try {
      const result = await UpdateBettingLimitsService.execute(req.body, req.context)
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
  static async updateDepositAndLossLimits (req, res, next) {
    try {
      const result = await UpdateDepositAndLossLimitsService.execute(req.body, req.context)
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
  static async updateSelfExclusion (req, res, next) {
    try {
      const result = await UpdateSelfExclusionService.execute(req.body, req.context)
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
  static async updateSessionLimit (req, res, next) {
    try {
      const result = await UpdateSessionLimitService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
