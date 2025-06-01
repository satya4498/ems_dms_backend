import { decorateResponse } from '@src/helpers/response.helpers'
import { GetReedemRequestsService } from '@src/services/playerManagement/redeem/getRedeemRequests.service'
import { UpdateRedeemStatusService } from '@src/services/playerManagement/redeem/updateRedeemStatus.service'

export class RedeemController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updateRedeemStatus (req, res, next) {
    try {
      const result = await UpdateRedeemStatusService.execute(req.body, req.context)
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
   static async getRedeemRequests (req, res, next) {
    try {
      const result = await GetReedemRequestsService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}