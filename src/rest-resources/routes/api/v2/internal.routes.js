import express from 'express'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { UserController } from '@src/rest-resources/controllers/user.controller'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'

const internalRouter = express.Router({ mergeParams: true })

internalRouter.post('/bulk-signup', isBasicAuthenticatedMiddleware, requestValidationMiddleware({}), UserController.bulkSignup, responseValidationMiddleware({}))

export default internalRouter
