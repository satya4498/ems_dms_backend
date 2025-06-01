import { CredentialsController, InternalController } from '@src/rest-resources/controllers/internal.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { isBasicAuthenticatedMiddleware } from '@src/rest-resources/middlewares/isBasicAuthenticated.middleware'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const supportedFileFormat = ['png', 'jpg', 'jpeg']
const internalRouter = express.Router({ mergeParams: true })

// GET REQUESTS
internalRouter.get('/data-populate', isBasicAuthenticatedMiddleware, InternalController.populateData, responseValidationMiddleware({}))

internalRouter.post('/create-credentials', isAuthenticated(), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('icon'), CredentialsController.createCredentials, responseValidationMiddleware({}))
internalRouter.get('/credentials', isAuthenticated(), CredentialsController.getCredentials, responseValidationMiddleware({}))
internalRouter.post('/update-credentials', isAuthenticated(), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('icon'), CredentialsController.updateCredentials, responseValidationMiddleware({}))

// reset super admin permissions
internalRouter.put('/super-admin', isAuthenticated(), CredentialsController.resetSuperAdmin, responseValidationMiddleware({}))

export { internalRouter }
