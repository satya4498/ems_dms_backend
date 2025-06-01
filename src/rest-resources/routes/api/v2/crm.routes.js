import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'
import { UserDisputeController } from '@src/rest-resources/controllers/crm.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'

const supportedFileFormats = ['jpeg', 'png', 'svg']
const crmRouter = express.Router({ mergeParams: true })

// user dispute-managemnt
crmRouter.get('/dispute-management/get-ticket', isAuthenticated(resources.disputeManagement.read), UserDisputeController.getTicket, responseValidationMiddleware({}))
crmRouter.get('/dispute-management/get-ticket-details', isAuthenticated(resources.disputeManagement.read), UserDisputeController.getTicketDetails, responseValidationMiddleware({}))
crmRouter.post('/dispute-management/update-status', isAuthenticated(resources.disputeManagement.update), databaseTransactionHandlerMiddleware, UserDisputeController.updateStatus, responseValidationMiddleware({}))
crmRouter.post('/dispute-management/reply-message', isAuthenticated(resources.disputeManagement.update), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormats).single('file'), UserDisputeController.replyMessage, responseValidationMiddleware({}))
crmRouter.post('/dispute-management/update-read', isAuthenticated(resources.disputeManagement.toggle_status), databaseTransactionHandlerMiddleware, UserDisputeController.updateMessageRead, responseValidationMiddleware({}))

export { crmRouter }
