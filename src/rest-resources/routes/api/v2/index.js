import express from 'express'
import { userRouter } from './user.routes'
import internalRouter from './internal.routes'
const v2Router = express.Router()

v2Router.use('/user', userRouter)
v2Router.use('/internal', internalRouter)

export { v2Router }
