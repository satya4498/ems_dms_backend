import { decorateResponse } from '@src/helpers/response.helpers'
import { GetEventMarketsService } from '@src/services/sportsbookManagement/getEventMarkets.service'
import { GetEventsService } from '@src/services/sportsbookManagement/getEvents.service'
import { GetLeaguesService } from '@src/services/sportsbookManagement/getLeagues.service'
import { GetMarketsService } from '@src/services/sportsbookManagement/getMarkets.service'
import { GetSportsOrLocationsService } from '@src/services/sportsbookManagement/getSportsOrLocations.service'
import { ToggleService } from '@src/services/sportsbookManagement/toggle.service'
import { UpdateEventService } from '@src/services/sportsbookManagement/updateEvent.service'
import { UploadIconsService } from '@src/services/sportsbookManagement/uploadIcons.service'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { SPORTSBOOK_ENTITY_TYPES } from '@src/utils/constants/sportbookManagement.constants'

export default class SportsbookManagementController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getSports (req, res, next) {
    try {
      const result = await GetSportsOrLocationsService.execute(req.query, req.context)
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
  static async getLocations (req, res, next) {
    try {
      const result = await GetSportsOrLocationsService.execute({ ...req.query, sportsData: false }, req.context)
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
  static async getLeagues (req, res, next) {
    try {
      const result = await GetLeaguesService.execute(req.query, req.context)
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
  static async getEvents (req, res, next) {
    try {
      const result = await GetEventsService.execute(req.query, req.context)
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
  static async getEventMarkets (req, res, next) {
    try {
      const result = await GetEventMarketsService.execute(req.query, req.context)
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
  static async getMarkets (req, res, next) {
    try {
      const result = await GetMarketsService.execute(req.query, req.context)
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
  static async toggleLocation (req, res, next) {
    try {
      const result = await ToggleService.execute({ ...req.body, type: SPORTSBOOK_ENTITY_TYPES.LOCATION }, req.context)
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
  static async toggleSport (req, res, next) {
    try {
      const result = await ToggleService.execute({ ...req.body, type: SPORTSBOOK_ENTITY_TYPES.SPORT }, req.context)
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
  static async toggleLeague (req, res, next) {
    try {
      const result = await ToggleService.execute({ ...req.body, type: SPORTSBOOK_ENTITY_TYPES.LEAGUE }, req.context)
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
  static async updateEvent (req, res, next) {
    try {
      const result = await UpdateEventService.execute(req.body, req.context)
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
  static async uploadSportIcon (req, res, next) {
    try {
      const result = await UploadIconsService.execute({ ...req.body, file: req.file, type: S3FolderHierarchy.sportsbookHirerachyTypeMap.sports }, req.context)
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
  static async uploadLocationIcon (req, res, next) {
    try {
      const result = await UploadIconsService.execute({ ...req.body, file: req.file, type: S3FolderHierarchy.sportsbookHirerachyTypeMap.locations }, req.context)
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
  static async uploadLeagueIcon (req, res, next) {
    try {
      const result = await UploadIconsService.execute({ ...req.body, file: req.file, type: S3FolderHierarchy.sportsbookHirerachyTypeMap.leagues }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
