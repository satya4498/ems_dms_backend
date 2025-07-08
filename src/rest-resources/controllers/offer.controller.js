import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateOfferService } from '@src/services/offer/createOffer.service'
import { GetOffersService } from '@src/services/offer/getOffers.service'
import { GetOfferService } from '@src/services/offer/getOffer.service'
import { UpdateOfferService } from '@src/services/offer/updateOffer.service'
import { DeleteOfferService } from '@src/services/offer/deleteOffer.service'

export class OfferController {
  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async create (req, res, next) {
    try {
      const result = await CreateOfferService.execute({ ...req.body, createdBy: req.authenticated.userId }, req.context)
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
  static async getAll (req, res, next) {
    try {
      const result = await GetOffersService.execute(req.query, req.context)
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
  static async getById (req, res, next) {
    try {
      const result = await GetOfferService.execute({ ...req.params }, req.context)
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
      const result = await UpdateOfferService.execute({ ...req.body, ...req.params, updatedBy: req.authenticated.userId }, req.context)
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
      const result = await DeleteOfferService.execute({ ...req.params, deletedBy: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
