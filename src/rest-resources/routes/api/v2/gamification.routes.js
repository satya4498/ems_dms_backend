import GamificationController from '@src/rest-resources/controllers/gamification.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { successSchema } from '@src/schema/successResponse.schema'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'

const supportedFileFormats = ['jpeg', 'png', 'svg']
const gamificationRouter = express.Router({ mergeParams: true })

// GET REQUEST
gamificationRouter.get('/', isAuthenticated(), GamificationController.getGamificationData, responseValidationMiddleware({}))
gamificationRouter.get('/tasks', isAuthenticated(), GamificationController.getGamificationTask, responseValidationMiddleware({}))
gamificationRouter.get('/task-details', isAuthenticated(), GamificationController.getGamificationTaskDetails, responseValidationMiddleware({}))

// POST REQUEST
gamificationRouter.post('/update', isAuthenticated(), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormats).single('file'), GamificationController.updateGamificationData, responseValidationMiddleware({}))
gamificationRouter.post('/create-task', isAuthenticated(), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormats).single('file'), GamificationController.createGamificationTask, responseValidationMiddleware({}))
gamificationRouter.post('/toggle', isAuthenticated(resources.gamification.toggle_status), GamificationController.toggleGamification, responseValidationMiddleware(successSchema))
gamificationRouter.post('/update-task', isAuthenticated(), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormats).single('file'), GamificationController.updateGamificationTask, responseValidationMiddleware({}))

// DELETE REQUEST
gamificationRouter.delete('/delete-task', isAuthenticated(), databaseTransactionHandlerMiddleware, GamificationController.deleteGamificationTask, responseValidationMiddleware({}))

export { gamificationRouter }
