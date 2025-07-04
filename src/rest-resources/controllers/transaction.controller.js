import { decorateResponse } from '@src/helpers/response.helpers'
import { GetBankingTransactionsService } from '@src/services/transaction/getBankingTransactions.service'
import { GetCasinoTransactionsService } from '@src/services/transaction/getCasinoTransactions.service'
import { GetLedgersService } from '@src/services/transaction/getLedgers.service'

export class TransactionController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getBankingTransactions (req, res, next) {
    try {
      const result = await GetBankingTransactionsService.execute(req.query, req.context)
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
  static async getCasinoTransactions (req, res, next) {
    try {
      const result = await GetCasinoTransactionsService.execute(req.query, req.context)
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
  static async getLedgers (req, res, next) {
    try {
      const result = await GetLedgersService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
