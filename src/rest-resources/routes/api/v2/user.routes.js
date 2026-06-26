import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
// import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
// import { getBankingTransactionSchema } from '@src/schema/transaction/bankingTransaction.schema'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
// import { resources } from '@src/utils/constants/permission.constant'
import { UserController } from '@src/rest-resources/controllers/user.controller'
import { USER_ROLE } from '@src/utils/constants/public.constants.utils'
// import { USER_ROLE } from '@src/utils/constants/public.constants.utils'
const userRouter = express.Router({ mergeParams: true })

// GET REQUESTS
userRouter.get('/profile', isAuthenticated(), UserController.getProfile, responseValidationMiddleware({}))
userRouter.get('/get-users', isAuthenticated(USER_ROLE.ADMIN), UserController.getUsers, responseValidationMiddleware({}))

export { userRouter }
