import './instrument'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import {errorHandlerMiddleware} from './middlewares/errorHandler.middleware'
import { appConfig } from '@src/configs'
import { contextMiddleware } from '@src/rest-resources/middlewares/context.middleware'
import routes from '@src/rest-resources/routes'

const app = express()

app.use(helmet())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(morgan('tiny'))

// CORS Configuration
app.use(cors({
  origin: appConfig.cors,
  credentials: true
}))

app.use(contextMiddleware)

app.use(routes)

app.use(async (req, res) => {
  res.status(404).json({ status: 'Not Found' })
})

app.use(errorHandlerMiddleware)

export default app
