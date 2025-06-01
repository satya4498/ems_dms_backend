import { KycController } from '@src/rest-resources/controllers/playerManagement/kyc.controller'
import { LimitController } from '@src/rest-resources/controllers/playerManagement/limit.controller'
import { PlayerController } from '@src/rest-resources/controllers/playerManagement/player.controller'
import { TagController } from '@src/rest-resources/controllers/playerManagement/tag.controller'
import { WheelDivisionConfigController } from '@src/rest-resources/controllers/playerManagement/wheelDivision.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { createCommentSchema } from '@src/schema/playerManagement/createComment.schema'
import { getDuplicatePlayerSchema } from '@src/schema/playerManagement/duplicatePlayer.schema'
import { getPlayerSchema } from '@src/schema/playerManagement/getPlayer.schema'
import { getPlayersSchema } from '@src/schema/playerManagement/getPlayers.schema'
import { createDocumentLabelSchema } from '@src/schema/playerManagement/kyc/createDocumentLabel.schema'
import { getDocumentLabelsSchema } from '@src/schema/playerManagement/kyc/getkycDocuments.schema'
import { kycVerificationSchema } from '@src/schema/playerManagement/kyc/kycVerification.schema'
import { manageWalletSchema } from '@src/schema/playerManagement/manageWallet.schema'
import { createNotificationSchema } from '@src/schema/playerManagement/notification/createNotification.schema'
import { getNotificationSchema } from '@src/schema/playerManagement/notification/getNotification.schema'
import { selfExclusionSchema } from '@src/schema/playerManagement/selfExclusion.schema'
import { attachTagSchema } from '@src/schema/playerManagement/tag/attachtag.schema'
import { createTagSchema } from '@src/schema/playerManagement/tag/createTag.schema'
import { getTagsSchema } from '@src/schema/playerManagement/tag/getTag.schema'
import { successSchema } from '@src/schema/successResponse.schema'
import { kycRequestsSchema } from '@src/schema/playerManagement/kyc/kycRequests.Schema'
import { resources } from '@src/utils/constants/permission.constant'
import { SegmentController } from '@src/rest-resources/controllers/playerManagement/segmentation.controller'

import express from 'express'
import { RedeemController } from '@src/rest-resources/controllers/playerManagement/redeem.controller'

const supportedFileFormat = ['png', 'jpg', 'jpeg']
const playerManagementRouter = express.Router()

// GET REQUESTS
playerManagementRouter.get('/player', isAuthenticated(resources.player.read), PlayerController.getPlayer, responseValidationMiddleware(getPlayerSchema))
playerManagementRouter.get('/players', isAuthenticated(resources.player.read), PlayerController.getPlayers, responseValidationMiddleware({}))
playerManagementRouter.get('/duplicate-players', isAuthenticated(resources.player.read), PlayerController.getDuplicatePlayers, responseValidationMiddleware(getDuplicatePlayerSchema))
playerManagementRouter.get('/kyc/document-labels', isAuthenticated(resources.kyc.read), KycController.getDocumentLabels, responseValidationMiddleware({}))
playerManagementRouter.get('/player/get-legders', isAuthenticated(resources.player.read), PlayerController.getLedgers, responseValidationMiddleware({})) // API not In-Use
playerManagementRouter.get('/player/get-casino-bets', isAuthenticated(resources.player.read), PlayerController.getCasinoBets, responseValidationMiddleware({})) // API not In-Use
playerManagementRouter.get('/player/get-sportsbook-bet', isAuthenticated(resources.player.read), PlayerController.getSportsbookBet, responseValidationMiddleware({})) // API not In-Use
playerManagementRouter.get('/player/get-sportsbook-bets', isAuthenticated(resources.player.read), PlayerController.getSportsbookBets, responseValidationMiddleware({})) // API not In-Use
playerManagementRouter.get('/notification', isAuthenticated(resources.notification.read), PlayerController.getAllNotification, responseValidationMiddleware(getNotificationSchema))
playerManagementRouter.get('/comments', isAuthenticated(resources.notification.read), PlayerController.getComment, responseValidationMiddleware({}))
playerManagementRouter.get('/duplicate-players/all', isAuthenticated(resources.player.read), PlayerController.getAllDuplicatePlayers, responseValidationMiddleware({}))
playerManagementRouter.get('/redeem/requests', isAuthenticated(), databaseTransactionHandlerMiddleware, RedeemController.getRedeemRequests, responseValidationMiddleware({}))

// Player segamentaion - Tags
playerManagementRouter.get('/tags', isAuthenticated(resources.segmentation.read), TagController.getTags, responseValidationMiddleware(getTagsSchema))
playerManagementRouter.post('/tag/create', isAuthenticated(resources.segmentation.create), TagController.createTag, responseValidationMiddleware(createTagSchema))
playerManagementRouter.post('/tag/attach-tag', isAuthenticated(resources.segmentation.issue), TagController.attachTagToPlayer, responseValidationMiddleware(attachTagSchema))
playerManagementRouter.post('/tag/remove-tag', isAuthenticated(resources.segmentation.delete), TagController.removeTagFromPlayer, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/tag/update-tag', isAuthenticated(resources.segmentation.update), TagController.updateTag, responseValidationMiddleware(successSchema))

playerManagementRouter.get('/segments', isAuthenticated(resources.segment.read), SegmentController.getSegments, responseValidationMiddleware({}))
playerManagementRouter.get('/segments/constants', isAuthenticated(resources.segment.read), SegmentController.getSegmentConstants, responseValidationMiddleware({}))
playerManagementRouter.get('/segment-users', isAuthenticated(resources.segment.read), SegmentController.getSegmentationUsers, responseValidationMiddleware({}))
playerManagementRouter.post('/segment-advance-filter', isAuthenticated(resources.player.read), SegmentController.segmentationAdvancedFilter, responseValidationMiddleware({}))
playerManagementRouter.get('/kyc/methods', isAuthenticated(), databaseTransactionHandlerMiddleware, KycController.getKycMethods, responseValidationMiddleware({}))

// POST REQUESTS
playerManagementRouter.post('/wallet', isAuthenticated(), databaseTransactionHandlerMiddleware, PlayerController.manageUserWallet, responseValidationMiddleware(manageWalletSchema))
playerManagementRouter.post('/limit/update-betting', isAuthenticated(resources.limits.update), databaseTransactionHandlerMiddleware, LimitController.updateBettingLimits, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/limit/update-self-exclusion', isAuthenticated(resources.limits.update), databaseTransactionHandlerMiddleware, LimitController.updateSelfExclusion, responseValidationMiddleware(selfExclusionSchema))
playerManagementRouter.post('/limit/update-deposit-and-loss', isAuthenticated(resources.limits.update), databaseTransactionHandlerMiddleware, LimitController.updateDepositAndLossLimits, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/limit/update-session', isAuthenticated(resources.limits.update), databaseTransactionHandlerMiddleware, LimitController.updateSessionLimit, responseValidationMiddleware({}))
playerManagementRouter.post('/kyc/verify-email', isAuthenticated(resources.kyc.update), KycController.verifyEmail, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/kyc/request-document', isAuthenticated(resources.kyc.update), KycController.requestDocument, responseValidationMiddleware(kycVerificationSchema))
playerManagementRouter.post('/kyc/verify-document', isAuthenticated(resources.kyc.update), KycController.verifyDocument, responseValidationMiddleware(kycVerificationSchema))
playerManagementRouter.post('/kyc/reject-document', isAuthenticated(resources.kyc.update), KycController.rejectDocument, responseValidationMiddleware(kycVerificationSchema))
playerManagementRouter.post('/kyc/document-label/create', isAuthenticated(resources.kyc.create), databaseTransactionHandlerMiddleware, KycController.createDocumentLabel, responseValidationMiddleware(createDocumentLabelSchema))
playerManagementRouter.post('/kyc/document-label/update', isAuthenticated(resources.kyc.update), KycController.updateDocumentLabel, responseValidationMiddleware(createDocumentLabelSchema))
playerManagementRouter.post('/kyc/activate', isAuthenticated(), databaseTransactionHandlerMiddleware, KycController.activateKyc, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/kyc/inactive', isAuthenticated(), databaseTransactionHandlerMiddleware, KycController.inactiveKyc, responseValidationMiddleware(successSchema))
playerManagementRouter.get('/kyc/kyc-requests', isAuthenticated(), databaseTransactionHandlerMiddleware, KycController.kycRequests, responseValidationMiddleware(kycRequestsSchema))
playerManagementRouter.post('/player/toggle', isAuthenticated(resources.player.toggle_status), PlayerController.togglePlayer, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/player/create-comment', isAuthenticated(resources.player.create), databaseTransactionHandlerMiddleware, PlayerController.createComment, responseValidationMiddleware(createCommentSchema))
playerManagementRouter.post('/player/update-comment', isAuthenticated(resources.player.update), databaseTransactionHandlerMiddleware, PlayerController.updateComment, responseValidationMiddleware(createCommentSchema))
playerManagementRouter.post('/player/update', isAuthenticated(), databaseTransactionHandlerMiddleware, PlayerController.updatePlayer, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/player/update-password', isAuthenticated(resources.player.update), databaseTransactionHandlerMiddleware, PlayerController.updatePlayerPassword, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/player/reset-password', isAuthenticated(resources.player.reset_password), PlayerController.resetPlayerPassword, responseValidationMiddleware(successSchema))
playerManagementRouter.post('/notification/create', isAuthenticated(resources.notification.create), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('file'), PlayerController.createNotification, responseValidationMiddleware(createNotificationSchema))
playerManagementRouter.post('/segment', isAuthenticated(resources.segment.create), databaseTransactionHandlerMiddleware, SegmentController.createSegment, responseValidationMiddleware({}))
playerManagementRouter.put('/segment', isAuthenticated(resources.segment.update), databaseTransactionHandlerMiddleware, SegmentController.editSegment, responseValidationMiddleware({}))
playerManagementRouter.post('/redeem/update-request', isAuthenticated(), databaseTransactionHandlerMiddleware, RedeemController.updateRedeemStatus, responseValidationMiddleware({}))
playerManagementRouter.post('/kyc/toggle-kyc-method', isAuthenticated(), databaseTransactionHandlerMiddleware, KycController.toggleKycMethod, responseValidationMiddleware(successSchema))

// DELETE REQUESTS
playerManagementRouter.delete('/tag', isAuthenticated(resources.segmentation.delete), TagController.deleteTag, responseValidationMiddleware(successSchema))
playerManagementRouter.delete('/player/comment', isAuthenticated(resources.comment.delete), PlayerController.deleteComment, responseValidationMiddleware(successSchema))
playerManagementRouter.delete('/kyc/document-label/delete', isAuthenticated(resources.kyc.delete), KycController.deteleDocumentLabel, responseValidationMiddleware(successSchema))
playerManagementRouter.delete('/segment', isAuthenticated(resources.segment.delete), SegmentController.deleteSegment, responseValidationMiddleware({}))

playerManagementRouter.post('/spin-wheel/update-config', isAuthenticated(), WheelDivisionConfigController.updateSpinWheelConfig, responseValidationMiddleware({}))
playerManagementRouter.get('/spin-wheel/get-config', WheelDivisionConfigController.getSpinWheelConfig, responseValidationMiddleware({}))
export { playerManagementRouter }
