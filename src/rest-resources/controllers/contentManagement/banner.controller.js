import { decorateResponse } from '@src/helpers/response.helpers'
import { createBannerService, updateBannerService, getBannerTypesService, getBannerService, ReorderGameService } from '@src/services/banner'
import { DeleteBannerService } from '@src/services/banner/deleteBanner.service'

export class BannerController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getBanners (req, res, next) {
    try {
      const result = await getBannerService.execute(req.query, req.context)
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
  static async deleteBanner (req, res, next) {
    try {
      const result = await DeleteBannerService.execute(req.query, req.context)
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
  static async createBannerController (req, res, next) {
    try {
      const result = await createBannerService.execute({ ...req.body, mobileFile: req.files?.mobileImage[0], desktopFile: req.files?.desktopImage[0] }, req.context)
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
  static async updateBannerController (req, res, next) {
    try {
      const result = await updateBannerService.execute({ ...req.body, mobileFile: req.files?.mobileImage ? req.files?.mobileImage[0] : null, desktopFile: req.files?.desktopImage ? req.files?.desktopImage[0] : null }, req.context)
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
  static async getBannersTypes (req, res, next) {
    try {
      const result = await getBannerTypesService.execute(req.query, req.context)
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
  static async reorderBanners (req, res, next) {
    try {
      const result = await ReorderGameService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
