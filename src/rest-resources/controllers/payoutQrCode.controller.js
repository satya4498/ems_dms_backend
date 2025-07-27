import { decorateResponse } from '@src/helpers/response.helpers'
import { CreatePayoutService } from '@src/services/payout/createPayout.service'
import { UpdatePayoutService } from '@src/services/payout/updatePayout.service'
import { DeletePayoutService } from '@src/services/payout/deletePayout.service'
import { GetPayoutService } from '@src/services/payout/getPayout.service'
import { RedeemQrCodeService } from '@src/services/payout/redeemQrCode.service'
import { ValidateQrCodeService } from '@src/services/payout/validateQrCode.service'
import { ApproveRedemptionService } from '@src/services/payout/approveRedemption.service'
import { GetPendingRedemptionsService } from '@src/services/payout/getPendingRedemptions.service'
export class PayoutQrCodeController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async create (req, res, next) {
    try {
      const result = await CreatePayoutService.execute({ ...req.body, createdBy: req.authenticated.userId }, req.context)
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
  static async update (req, res, next) {
    try {
      const result = await UpdatePayoutService.execute({ ...req.body, createdBy: req.authenticated.userId }, req.context)
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
  static async delete (req, res, next) {
    try {
      const result = await DeletePayoutService.execute({ ...req.body, createdBy: req.authenticated.userId }, req.context)
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
  static async getPayout (req, res, next) {
    try {
      const result = await GetPayoutService.execute({ ...req.query, createdBy: req.authenticated.userId }, req.context)
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
  static async validateQrCode (req, res, next) {
    try {
      const result = await ValidateQrCodeService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
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
  static async redeemPayoutRequest (req, res, next) {
    try {
      const result = await RedeemQrCodeService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
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
  static async approveRedemption (req, res, next) {
    try {
      const result = await ApproveRedemptionService.execute({ ...req.body, adminId: req.authenticated.userId }, req.context)
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
  static async getPendingRedemptions (req, res, next) {
    try {
      const result = await GetPendingRedemptionsService.execute({ ...req.query, adminId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
