import * as Sentry from '@sentry/node'
import { appConfig } from '@src/configs'

Sentry.init({
  dsn: appConfig.sentry.secret,
  environment: appConfig.sentry.env,
  tracesSampleRate: 1.0 //  Capture 100% of the transactions
})
