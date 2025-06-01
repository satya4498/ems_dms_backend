import PaymentProviderController from '@src/rest-resources/controllers/payment.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'

const supportedFileFormat = ['png', 'jpg', 'jpeg']
const paymentRouter = express.Router({ mergeParams: true })

// GET
paymentRouter.get('', isAuthenticated(), PaymentProviderController.getAllPaymentProviders, responseValidationMiddleware({}))
paymentRouter.get('/details', isAuthenticated(), PaymentProviderController.getPaymentProvider, responseValidationMiddleware({}))

// POST
paymentRouter.post('/update', isAuthenticated(), fileUpload(supportedFileFormat).single('image'), databaseTransactionHandlerMiddleware, PaymentProviderController.updatePaymentProvider, responseValidationMiddleware({}))
paymentRouter.post('/create', isAuthenticated(), fileUpload(supportedFileFormat).single('image'), databaseTransactionHandlerMiddleware, PaymentProviderController.createPaymentProvider, responseValidationMiddleware({}))

export { paymentRouter }
