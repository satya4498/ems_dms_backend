import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateContactService } from '@src/services/razorpay/createContact.service'
import { AddBankAccountService } from '@src/services/razorpay/addBankAccount.service'
import { GetContactService } from '@src/services/razorpay/getContact.service'
import { CreatePayoutService } from '@src/services/razorpay/createPayout.service'

export class RazorpayController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async createContact (req, res, next) {
    try {
      const result = await CreateContactService.execute({
        ...req.body,
        userId: req.authenticated.userId
      }, req.context)
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
  static async addBankAccount (req, res, next) {
    try {
      const result = await AddBankAccountService.execute({
        ...req.body,
        userId: req.authenticated.userId
      }, req.context)
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
  static async getContact (req, res, next) {
    try {
      const result = await GetContactService.execute({
        ...req.query,
        userId: req.authenticated.userId
      }, req.context)
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
  static async createPayout (req, res, next) {
    try {
      const result = await CreatePayoutService.execute({
        ...req.body,
        userId: req.authenticated.userId
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
