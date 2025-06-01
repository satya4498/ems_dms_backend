import { decorateResponse } from '@src/helpers/response.helpers'
import { GetGamificationDataService } from '@src/services/gamification/getGamificationData.service'
import { UpdateGamificationDataService } from '@src/services/gamification/updateGamificationData.service'
import { CreateGamificationTaskService } from '@src/services/gamification/createGamificationTask.service'
import { UpdateGamificationTaskService } from '@src/services/gamification/updateGamificationTask.service'
import { DeleteGamificationTaskService } from '@src/services/gamification/deleteGamificationTask.service'
import { GetGamificationTaskService } from '@src/services/gamification/getGamificationTask.service'
import { GetGamificationTaskDetailsService } from '@src/services/gamification/getGamificationTaskDetails.service'
import { ToggleGamificationService } from '@src/services/gamification/toggleGamification.service'

export default class GamificationController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getGamificationData (req, res, next) {
    try {
      const result = await GetGamificationDataService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getGamificationTask (req, res, next) {
    try {
      const result = await GetGamificationTaskService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getGamificationTaskDetails (req, res, next) {
    try {
      const result = await GetGamificationTaskDetailsService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateGamificationData (req, res, next) {
    try {
      const result = await UpdateGamificationDataService.execute({ ...req.body, iconImage: req.file }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async createGamificationTask (req, res, next) {
    try {
      const result = await CreateGamificationTaskService.execute({ ...req.body, imageUrl: req.file }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async updateGamificationTask (req, res, next) {
    try {
      const result = await UpdateGamificationTaskService.execute({ ...req.body, imageUrl: req.file }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async toggleGamification (req, res, next) {
    try {
      const result = await ToggleGamificationService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async deleteGamificationTask (req, res, next) {
    try {
      const result = await DeleteGamificationTaskService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
