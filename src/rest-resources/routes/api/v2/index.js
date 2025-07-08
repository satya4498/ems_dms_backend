import express from 'express'
// import { internalRouter } from './internal.routes'
// import { transactionRouter } from './transaction.routes'
import { userRouter } from './user.routes'
import { payoutRouter } from './payout.routes'
import { razorpayRouter } from './razorpay.routes'
import { offerRouter } from './offer.routes'
const v2Router = express.Router()

// v2Router.use('/internal', internalRouter)
// v2Router.use('/transaction', transactionRouter)
v2Router.use('/user', userRouter)
v2Router.use('/payout', payoutRouter)
v2Router.use('/razorpay', razorpayRouter)
v2Router.use('/offer', offerRouter)
export { v2Router }
