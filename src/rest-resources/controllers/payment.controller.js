import { decorateResponse } from '@src/helpers/response.helpers'
import { CreatePaymentProviderService } from '@src/services/payment/createPaymentProvider.service'
import { GetPaymentProvidersService } from '@src/services/payment/getPaymentProviders.service'
import { GetPaymentProviderService } from '@src/services/payment/getPaymentProvidersDetails.service'
import { UpdatePaymentProviderService } from '@src/services/payment/updatePaymentProvider.service'

export default class PaymentProviderController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async getAllPaymentProviders (req, res, next) {
    try {
      const result = await GetPaymentProvidersService.execute(req.query, req.context)
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
  static async getPaymentProvider (req, res, next) {
    try {
      const result = await GetPaymentProviderService.execute(req.query, req.context)
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
  static async updatePaymentProvider (req, res, next) {
    try {
      const result = await UpdatePaymentProviderService.execute({ ...req.body, image: req.file }, req.context)
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
  static async createPaymentProvider (req, res, next) {
    try {
      const result = await CreatePaymentProviderService.execute({ ...req.body, image: req.file }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
