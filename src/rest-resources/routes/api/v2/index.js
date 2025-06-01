import express from 'express'
import { adminRouter } from './admin.routes'
import { amoeRouter } from './amoe.routes'
import { bonusManagementRouter } from './bonusManagement.routes'
import { casinoManagementRouter } from './casinoManagement.routes'
import { contentManagementRoutes } from './contentManagement.routes'
import { crmRouter } from './crm.routes'
import { dashboardRoutes } from './dashborad.routes'
import { internalRouter } from './internal.routes'
import { liveChatRouter } from './liveChat.routes'
import { paymentRouter } from './payment.routes'
import { playerManagementRouter } from './playerManagement.routes'
import { settingsRoutes } from './settings.routes'
import { sportsbookManagementRouter } from './sportsbookManagement.routes'
import { storeRouter } from './store.routes'
import { tournamentRouter } from './tournament.routes'
import { transactionRouter } from './transaction.routes'
import { logsRouter } from './adminActivityLogs.routes'
import { gamificationRouter } from './gamification.routes'

const v2Router = express.Router()

v2Router.use('/admin', adminRouter)
v2Router.use('/settings', settingsRoutes)
v2Router.use('/dashboard', dashboardRoutes)
v2Router.use('/internal', internalRouter)
v2Router.use('/transaction', transactionRouter)
v2Router.use('/player-management', playerManagementRouter)
v2Router.use('/casino-management', casinoManagementRouter)
v2Router.use('/content-management', contentManagementRoutes)
v2Router.use('/sportsbook-management', sportsbookManagementRouter)
v2Router.use('/bonus-management', bonusManagementRouter)
v2Router.use('/tournament', tournamentRouter)
v2Router.use('/payment', paymentRouter)
v2Router.use('/live-chat', liveChatRouter)
v2Router.use('/crm', crmRouter)
v2Router.use('/store', storeRouter)
v2Router.use('/amoe', amoeRouter)
v2Router.use('/logs', logsRouter)
v2Router.use('/gamification', gamificationRouter)

export { v2Router }
