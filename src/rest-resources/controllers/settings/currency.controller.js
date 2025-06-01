import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateCurrencyService } from '@src/services/currency/createCurrency.service'
import { GetCurrenciesService } from '@src/services/currency/getCurrencies.service'
import { SetDefaultCurrenciesService } from '@src/services/currency/setDefaultCurrency.service'
import { ToggleCurrencyService } from '@src/services/currency/toggleCurrency.service'
import { UpdateCurrencyService } from '@src/services/currency/updateCurrency.service'

export class CurrencyController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getCurrencies (req, res, next) {
    try {
      const result = await GetCurrenciesService.execute(req.query, req.context)
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
  static async createCurrency (req, res, next) {
    try {
      const result = await CreateCurrencyService.execute(req.body, req.context)
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
  static async updateCurrency (req, res, next) {
    try {
      const result = await UpdateCurrencyService.execute(req.body, req.context)
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
  static async setDefaultCurrency (req, res, next) {
    try {
      const result = await SetDefaultCurrenciesService.execute(req.body, req.context)
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
  static async toggleCurrency (req, res, next) {
    try {
      const result = await ToggleCurrencyService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
