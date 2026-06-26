import express from 'express'
import { v2Router } from './v2'

const apiRouter = express.Router()

// apiRouter.use('/v1', v1Router)
apiRouter.use('/v2', v2Router)

export { apiRouter }
