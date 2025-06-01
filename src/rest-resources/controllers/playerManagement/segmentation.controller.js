import { decorateResponse } from '@src/helpers/response.helpers'
import { GetSegmentationService } from '@src/services/playerManagement/segmentation/getSegmentationService'
import { EditSegmentationService } from '@src/services/playerManagement/segmentation/editSegmentService'
import { CreateSegmentationService } from '@src/services/playerManagement/segmentation/createSegmentService'
import { DeleteSegmentationService } from '@src/services/playerManagement/segmentation/deleteSegmentService'
import { SegmentConstantsService } from '@src/services/playerManagement/segmentation/segmentConstantsService'
import { GetSegmentationUsersService } from '@src/services/playerManagement/segmentation/getSegmentUsersService'
import { SegmentationAdvancedFilterService } from '@src/services/playerManagement/segmentation/segmentAdvancedFilter'

export class SegmentController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getSegments (req, res, next) {
    try {
      const result = await GetSegmentationService.execute(req.query, req.context)
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
    static async createSegment (req, res, next) {
      try {
        const result = await CreateSegmentationService.execute(req.body, req.context)
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
  static async editSegment (req, res, next) {
    try {
      const result = await EditSegmentationService.execute(req.body, req.context)
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
    static async deleteSegment (req, res, next) {
      try {
        const result = await DeleteSegmentationService.execute(req.query, req.context)
        decorateResponse({ req, res, next }, result)
      } catch (error) {
        next(error)
      }
    }
     /**

        /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
     static async getSegmentConstants (req, res, next) {
      try {
        const result = await SegmentConstantsService.execute(req.query, req.context)
        decorateResponse({ req, res, next }, result)
      }
      catch (error) {
        next(error)
      }
    }

    static async getSegmentationUsers (req, res, next) {
      try {
        const result = await GetSegmentationUsersService.execute(req.query, req.context)
        decorateResponse({ req, res, next }, result)
      } catch (error) {
        next(error)
      }
    }

    static async segmentationAdvancedFilter (req, res, next) {
      try {
        const result = await SegmentationAdvancedFilterService.execute(req.body, req.context)
        decorateResponse({ req, res, next }, result)
      } catch (error) {
        next(error)
      }
    }
}
