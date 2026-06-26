import express from 'express'
import { userRouter } from './user.routes'
const v2Router = express.Router()

v2Router.use('/user', userRouter)

export { v2Router }
