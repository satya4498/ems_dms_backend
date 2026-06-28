import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { UserController } from '@src/rest-resources/controllers/user.controller'
import { USER_ROLE } from '@src/utils/constants/public.constants.utils'
import { signUpBodySchema } from '@src/schema/user/signUp.schema'
import { signInBodySchema } from '@src/schema/user/signIn.schema'
import { forgotPasswordBodySchema } from '@src/schema/user/forgotPassword.schema'
import { resetPasswordBodySchema } from '@src/schema/user/resetPassword.schema'
import { sendEmailOtpBodySchema } from '@src/schema/user/sendEmailOtp.schema'
import { verifyEmailOtpBodySchema } from '@src/schema/user/verifyEmailOtp.schema'
import { updateProfileSchema } from '@src/schema/user/updateProfile.schema'
import { toggleUserSchema } from '@src/schema/user/toggleUser.schema'
import { getUsersSchema } from '@src/schema/user/getUsers.schema'
import { getProfileSchema } from '@src/schema/user/getProfile.schema'

const userRouter = express.Router({ mergeParams: true })

// POST REQUESTS
userRouter.post('/sign-up', requestValidationMiddleware({ body: signUpBodySchema }), UserController.signUp, responseValidationMiddleware({}))
userRouter.post('/sign-in', requestValidationMiddleware({ body: signInBodySchema }), UserController.signIn, responseValidationMiddleware({}))
userRouter.post('/forgot-password', requestValidationMiddleware({ body: forgotPasswordBodySchema }), UserController.forgotPassword, responseValidationMiddleware({}))
userRouter.post('/reset-password', requestValidationMiddleware({ body: resetPasswordBodySchema }), UserController.resetPassword, responseValidationMiddleware({}))
userRouter.post('/send-email-otp', requestValidationMiddleware({ body: sendEmailOtpBodySchema }), UserController.sendEmailOtp, responseValidationMiddleware({}))
userRouter.post('/verify-email-otp', requestValidationMiddleware({ body: verifyEmailOtpBodySchema }), UserController.verifyEmailOtp, responseValidationMiddleware({}))
userRouter.post('/update-profile', isAuthenticated(), requestValidationMiddleware({ body: updateProfileSchema.body }), UserController.updateProfile, responseValidationMiddleware({}))
userRouter.post('/toggle-user', isAuthenticated(), requestValidationMiddleware({ body: toggleUserSchema.body }), UserController.toggleUser, responseValidationMiddleware({}))

// GET REQUESTS
userRouter.get('/profile', isAuthenticated(), requestValidationMiddleware(getProfileSchema), UserController.getProfile, responseValidationMiddleware({}))
userRouter.get('/get-users', isAuthenticated(), requestValidationMiddleware(getUsersSchema), UserController.getUsers, responseValidationMiddleware({}))

export { userRouter }
