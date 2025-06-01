import { AmoeController } from '@src/rest-resources/controllers/amoe.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'

const amoeRouter = express.Router({ mergeParams: true })


// GET
amoeRouter.get('/requests', isAuthenticated(resources.amoe.read), requestValidationMiddleware({}), AmoeController.getAllAmoEnties, responseValidationMiddleware({}))

// POST
amoeRouter.post('/manage', isAuthenticated(resources.amoe.update), requestValidationMiddleware({}), databaseTransactionHandlerMiddleware, AmoeController.manageAmoEntries, responseValidationMiddleware({}))
amoeRouter.post('/update-address', requestValidationMiddleware({}), AmoeController.updateAmoeAddress, responseValidationMiddleware({}))


export { amoeRouter }
