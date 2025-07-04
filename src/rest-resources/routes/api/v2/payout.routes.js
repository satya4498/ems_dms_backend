import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { PayoutQrCodeController } from '@src/rest-resources/controllers/payoutQrCode.controller'
import { USER_ROLE } from '@src/utils/constants/public.constants.utils'

const payoutRouter = express.Router({ mergeParams: true })

// CREATE
payoutRouter.post('/payout/create', isAuthenticated(USER_ROLE.ADMIN), PayoutQrCodeController.create, responseValidationMiddleware({}))
// READ ALL
payoutRouter.get('/payout', isAuthenticated(), PayoutQrCodeController.list, responseValidationMiddleware({}))
// READ ONE
payoutRouter.get('/payout', isAuthenticated(), PayoutQrCodeController.getById, responseValidationMiddleware({}))
// UPDATE
payoutRouter.post('/payout/update', isAuthenticated(), PayoutQrCodeController.update, responseValidationMiddleware({}))
// DELETE
payoutRouter.delete('/payout/delete', isAuthenticated(), PayoutQrCodeController.delete, responseValidationMiddleware({}))

export { payoutRouter }
