import express from 'express'
// import { internalRouter } from './internal.routes'
// import { transactionRouter } from './transaction.routes'
import { userRouter } from './user.routes'
const v2Router = express.Router()

// v2Router.use('/internal', internalRouter)
// v2Router.use('/transaction', transactionRouter)
v2Router.use('/user', userRouter)
export { v2Router }
