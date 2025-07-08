import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
// import { getBankingTransactionSchema } from '@src/schema/transaction/bankingTransaction.schema'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
// import { resources } from '@src/utils/constants/permission.constant'
import { UserController } from '@src/rest-resources/controllers/user.controller'
import { updateProfileSchema } from '@src/schema/user'
// import { USER_ROLE } from '@src/utils/constants/public.constants.utils'
const userRouter = express.Router({ mergeParams: true })

// GET REQUESTS
userRouter.post('/send-otp', UserController.sendOtp, responseValidationMiddleware({}))
userRouter.post('/verify-otp', UserController.verifyOtp, responseValidationMiddleware({}))
userRouter.get('/profile', isAuthenticated(), UserController.getProfile, responseValidationMiddleware({}))
userRouter.post('/update-profile', isAuthenticated(), requestValidationMiddleware(updateProfileSchema), UserController.updateProfile, responseValidationMiddleware(updateProfileSchema))
userRouter.get('/transactions', isAuthenticated(), UserController.getTransactionHistory, responseValidationMiddleware({}))
export { userRouter }
