import '@src/libs/gracefulShutdown'
import { Logger } from '@src/libs/logger'
import  socketServer  from '@src/socket-resources'
import app from './src/rest-resources'
import { createServer } from 'http'
import { appConfig } from '@src/configs'


(async () => {
  const port = appConfig.port

  const httpServer = createServer(app)

  socketServer.attach(httpServer)

  httpServer.listen({ port }, async () => {
    Logger.info('Server', { message: `Listening on ${port}` })
  })
})()
