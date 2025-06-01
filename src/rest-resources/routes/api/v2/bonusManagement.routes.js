import BonusController from '@src/rest-resources/controllers/bonus.controller'
import { ReferralController } from '@src/rest-resources/controllers/referral.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import { createBonusSchema } from '@src/schema/bonus/createBonus.schema'
import { successSchema } from '@src/schema/successResponse.schema'
import { issueBonusSchema } from '@src/schema/bonus/issueBonus.schema'
import { getBonusSchema } from '@src/schema/bonus/getBonus.schema'
import { getBonusDetailsSchema } from '@src/schema/bonus/getBonusDetails.schema'
import { getUserBonusSchema } from '@src/schema/bonus/getUserBonus.schema'
import { getWageringTemplateSchema } from '@src/schema/bonus/getWageringTemplated.schema'
import { getWageringTemplateDetailsSchema } from '@src/schema/bonus/getWageringTemplateDetails.schema'
import { getReferralUserSchema } from '@src/schema/bonus/referral/getReferralUser.schema'
import { getReferralTransactionSchema } from '@src/schema/bonus/referral/getReferralTransaction.schema'

import express from 'express'

const supportedFileFormat = ['png', 'jpg', 'jpeg']
const bonusManagementRouter = express.Router({ mergeParams: true })

// GET REQUESTS
bonusManagementRouter.get('/bonus', isAuthenticated(resources.bonus.read), BonusController.getBonusDetail, responseValidationMiddleware({}))
bonusManagementRouter.get('/bonuses', isAuthenticated(resources.bonus.read), BonusController.getAllBonus, responseValidationMiddleware(getBonusSchema))
bonusManagementRouter.get('/user-bonuses', isAuthenticated(resources.bonus.read), BonusController.getUserBonus, responseValidationMiddleware(getUserBonusSchema))
bonusManagementRouter.get('/wagering-template', isAuthenticated(resources.bonus.read), BonusController.getWageringTemplateDetails, responseValidationMiddleware(getWageringTemplateDetailsSchema))
bonusManagementRouter.get('/wagering-templates', BonusController.getAllWageringTemplates, responseValidationMiddleware(getWageringTemplateSchema))
bonusManagementRouter.get('/spin-wheel-config', isAuthenticated(resources.bonus.read), BonusController.getSpinWheelConfigurations, responseValidationMiddleware({}))
bonusManagementRouter.get('/bonus-type-count', isAuthenticated(resources.bonus.read), BonusController.getAllBonusCount, responseValidationMiddleware({}))
bonusManagementRouter.get('/loyalty-levels', isAuthenticated(resources.bonus.read), BonusController.getLoyaltyLevels, responseValidationMiddleware({}))
bonusManagementRouter.get('/loyalty-level-users', isAuthenticated(resources.bonus.read), BonusController.getLoyaltyLevelUsers, responseValidationMiddleware({}))

// POST REQUESTS
bonusManagementRouter.post('/bonus/create', isAuthenticated(resources.bonus.create), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('file'), BonusController.createBonus, responseValidationMiddleware(createBonusSchema))
bonusManagementRouter.post('/bonus/update', isAuthenticated(resources.bonus.update), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('file'), BonusController.updateBonus, responseValidationMiddleware(createBonusSchema))
bonusManagementRouter.post('/bonus/reorder', isAuthenticated(), databaseTransactionHandlerMiddleware, BonusController.reorderBonuses, responseValidationMiddleware(successSchema))
bonusManagementRouter.post('/wagering-template/create', isAuthenticated(resources.bonus.create), databaseTransactionHandlerMiddleware, BonusController.createWageringTemplate, responseValidationMiddleware(successSchema))
bonusManagementRouter.post('/wagering-template/update', isAuthenticated(resources.bonus.update), databaseTransactionHandlerMiddleware, BonusController.updateWageringTemplate, responseValidationMiddleware({}))
bonusManagementRouter.post('/bonus/toggle', isAuthenticated(resources.bonus.toggle), BonusController.toggleBonus, responseValidationMiddleware(successSchema))
bonusManagementRouter.post('/bonus/issue', isAuthenticated(resources.bonus.issue), databaseTransactionHandlerMiddleware, BonusController.issueBonus, responseValidationMiddleware(issueBonusSchema))
bonusManagementRouter.post('/bonus/cancel', isAuthenticated(resources.bonus.update), databaseTransactionHandlerMiddleware, BonusController.cancelBonus, responseValidationMiddleware(successSchema))
bonusManagementRouter.post('/spin-wheel-config/update', isAuthenticated(resources.bonus.update), databaseTransactionHandlerMiddleware, BonusController.updateSpinWheelConfig, responseValidationMiddleware({}))
bonusManagementRouter.post('/loyalty-level/create', isAuthenticated(resources.bonus.create),databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('file'), BonusController.createLoyaltyLevels, responseValidationMiddleware({}))
bonusManagementRouter.post('/loyalty-level/update', isAuthenticated(resources.bonus.update), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('file'), BonusController.updateLoyaltyLevels, responseValidationMiddleware({}))

// DELETE REQUEST
bonusManagementRouter.delete('/bonus/delete', isAuthenticated(resources.bonus.delete), BonusController.deleteBonus, responseValidationMiddleware(successSchema))
bonusManagementRouter.delete('/spin-wheel-config/delete', isAuthenticated(resources.bonus.delete), BonusController.deleteSpinWheelConfig, responseValidationMiddleware(successSchema))
bonusManagementRouter.delete('/loyalty-level/delete', isAuthenticated(resources.bonus.delete), BonusController.deleteLoyaltyLevels, responseValidationMiddleware(successSchema))

// Referral Routes
bonusManagementRouter.post('/referral/update', isAuthenticated(resources.referral.update), ReferralController.referralUpdate, responseValidationMiddleware(successSchema))
bonusManagementRouter.get('/referral/users', isAuthenticated(), ReferralController.getReferralUserDetails, responseValidationMiddleware(getReferralUserSchema))
bonusManagementRouter.get('/referral/transactions', isAuthenticated(), ReferralController.getReferralTransactions, responseValidationMiddleware(getReferralTransactionSchema))

export { bonusManagementRouter }
