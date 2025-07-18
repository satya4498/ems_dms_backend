import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { PayoutQrCodeController } from '@src/rest-resources/controllers/payoutQrCode.controller'
import { USER_ROLE } from '@src/utils/constants/public.constants.utils'
import { redeemQrCodeSchema, approveRedemptionSchema, getPendingRedemptionsSchema } from '@src/schema/payout'
const payoutRouter = express.Router({ mergeParams: true })

// QR Code Management (Admin only)
payoutRouter.post('/payout/create', isAuthenticated(USER_ROLE.ADMIN), PayoutQrCodeController.create, responseValidationMiddleware({}))
payoutRouter.get('/payout', isAuthenticated(USER_ROLE.ADMIN), PayoutQrCodeController.getPayout, responseValidationMiddleware({}))
payoutRouter.post('/payout/update', isAuthenticated(USER_ROLE.ADMIN), PayoutQrCodeController.update, responseValidationMiddleware({}))
payoutRouter.delete('/payout/delete', isAuthenticated(USER_ROLE.ADMIN), PayoutQrCodeController.delete, responseValidationMiddleware({}))

// QR Code Redemption (User)
payoutRouter.post('/redeem', isAuthenticated(USER_ROLE.USER), requestValidationMiddleware(redeemQrCodeSchema), PayoutQrCodeController.redeemPayoutRequest, responseValidationMiddleware(redeemQrCodeSchema))

// Redemption Management (Admin only)
payoutRouter.get('/redemptions', isAuthenticated(USER_ROLE.ADMIN), requestValidationMiddleware(getPendingRedemptionsSchema), PayoutQrCodeController.getPendingRedemptions, responseValidationMiddleware({}))
payoutRouter.post('/redemptions/approve', isAuthenticated(USER_ROLE.ADMIN), requestValidationMiddleware(approveRedemptionSchema), PayoutQrCodeController.approveRedemption, responseValidationMiddleware({}))

export { payoutRouter }
