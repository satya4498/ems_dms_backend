import { AdminActivityLogsController } from '@src/rest-resources/controllers/adminActivityLogs.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const logsRouter = express.Router({ mergeParams: true })

// GET REQUESTS
logsRouter.get('/', isAuthenticated(), AdminActivityLogsController.getActivityLogs, responseValidationMiddleware({}))

export { logsRouter }
