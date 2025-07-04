import { decorateResponse } from '@src/helpers/response.helpers'
import { CreatePayoutService } from '@src/services/payout/createPayout.service'
export class PayoutQrCodeController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async create (req, res, next) {
    try {
      const result = await CreatePayoutService.execute({ ...req.body, createdBy: req.authenticated.userId }, this.context)
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
      const result = await CreatePayoutService.execute({ ...req.body, createdBy: req.authenticated.userId }, this.context)
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
      const result = await CreatePayoutService.execute({ ...req.body, createdBy: req.authenticated.userId }, this.context)
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
      const result = await CreatePayoutService.execute({ ...req.body, createdBy: req.authenticated.userId }, this.context)
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
  static async approvePayout (req, res, next) {
    try {
      const result = await CreatePayoutService.execute({ ...req.body, createdBy: req.authenticated.userId }, this.context)
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
      const result = await CreatePayoutService.execute({ ...req.body, createdBy: req.authenticated.userId }, this.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
