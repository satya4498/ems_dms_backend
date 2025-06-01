import SportsbookManagementController from '@src/rest-resources/controllers/sportsbookManagement.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import { successSchema } from '@src/schema/successResponse.schema'
import { uploadSportsBookImageSchema } from '@src/schema/sportsBook/sportsBookImageUpload.schema'
import { getSportsSchema } from '@src/schema/sportsBook/getSports.schema'
import { getEventsSchema } from '@src/schema/sportsBook/getEvents.schema'
import { getSportsBookLeaguesSchema } from '@src/schema/sportsBook/getSportsBookLeagues.schema'
import { getMarketsSchema } from '@src/schema/sportsBook/getMarkets.schema'
import { getLocationsSchema } from '@src/schema/sportsBook/getLocations.schema'
import { getEventsMarketsSchema } from '@src/schema/sportsBook/getEventMarkets.schema'
import express from 'express'

const supportedFileFormat = ['png']
const sportsbookManagementRouter = express.Router()

// GET REQUESTS
sportsbookManagementRouter.get('/sports', isAuthenticated(), SportsbookManagementController.getSports, responseValidationMiddleware(getSportsSchema))
sportsbookManagementRouter.get('/events', isAuthenticated(), SportsbookManagementController.getEvents, responseValidationMiddleware(getEventsSchema))
sportsbookManagementRouter.get('/leagues', isAuthenticated(), SportsbookManagementController.getLeagues, responseValidationMiddleware(getSportsBookLeaguesSchema))
sportsbookManagementRouter.get('/markets', isAuthenticated(), SportsbookManagementController.getMarkets, responseValidationMiddleware(getMarketsSchema))
sportsbookManagementRouter.get('/locations', isAuthenticated(), SportsbookManagementController.getLocations, responseValidationMiddleware(getLocationsSchema))
sportsbookManagementRouter.get('/event-markets', isAuthenticated(), SportsbookManagementController.getEventMarkets, responseValidationMiddleware(getEventsMarketsSchema))

// POST REQUESTS
sportsbookManagementRouter.post('/update-event', isAuthenticated(), SportsbookManagementController.updateEvent, responseValidationMiddleware(successSchema))
sportsbookManagementRouter.post('/toggle-sport', isAuthenticated(), SportsbookManagementController.toggleSport, responseValidationMiddleware(successSchema))
sportsbookManagementRouter.post('/toggle-league', isAuthenticated(), SportsbookManagementController.toggleLeague, responseValidationMiddleware(successSchema))
sportsbookManagementRouter.post('/toggle-location', isAuthenticated(), SportsbookManagementController.toggleLocation, responseValidationMiddleware(successSchema))
sportsbookManagementRouter.post('/upload-sport-icon', isAuthenticated(), fileUpload(supportedFileFormat).single('file'), SportsbookManagementController.uploadSportIcon, responseValidationMiddleware(uploadSportsBookImageSchema))
sportsbookManagementRouter.post('/upload-league-icon', isAuthenticated(), fileUpload(supportedFileFormat).single('file'), SportsbookManagementController.uploadLeagueIcon, responseValidationMiddleware(uploadSportsBookImageSchema))
sportsbookManagementRouter.post('/upload-location-icon', isAuthenticated(), fileUpload(supportedFileFormat).single('file'), SportsbookManagementController.uploadLocationIcon, responseValidationMiddleware(uploadSportsBookImageSchema))

export { sportsbookManagementRouter }
