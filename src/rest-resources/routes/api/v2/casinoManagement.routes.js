import { CasinMoanagementController } from '@src/rest-resources/controllers/casinoManagement.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'
import { successSchema } from '@src/schema/successResponse.schema'
import { createCategorySchema } from '@src/schema/casino/createCategory.schema'
import { editProviderSchema } from '@src/schema/casino/editProvider.schema'
import { editGameSchema } from '@src/schema/casino/editGame.schema'
import { getAggregatorsSchema } from '@src/schema/casino/getAggreator.schema'
import { getProvidersSchema } from '@src/schema/casino/getProvider.schema'
import { getCategoriesSchema } from '@src/schema/casino/getCategory.schema'
import { getGamesSchema } from '@src/schema/casino/getGames.schema'
import { editGameSchemaStates } from '@src/schema/casino/editGameSchemaStates'
import { editProviderSchemaStates } from '@src/schema/casino/editProviderSchemaStates'
import { editAggregatorSchema } from '@src/schema/casino/editAggregator.schema'
import { createProviderSchema } from '@src/schema/casino/createProvider.schema'

const supportedFileFormats = ['jpeg', 'png', 'svg']
const casinoManagementRouter = express.Router()

// GET REQUESTS
casinoManagementRouter.get('/aggregators', isAuthenticated(resources.casinoManagement.read), CasinMoanagementController.getAggregators, responseValidationMiddleware(getAggregatorsSchema))
casinoManagementRouter.get('/providers', isAuthenticated(resources.casinoManagement.read), CasinMoanagementController.getProviders, responseValidationMiddleware(getProvidersSchema))
casinoManagementRouter.get('/categories', isAuthenticated(resources.casinoManagement.read), CasinMoanagementController.getCategories, responseValidationMiddleware(getCategoriesSchema))
casinoManagementRouter.get('/games', isAuthenticated(resources.casinoManagement.read), CasinMoanagementController.getGames, responseValidationMiddleware(getGamesSchema))

// POST REQUESTS
casinoManagementRouter.post('/create-category', isAuthenticated(resources.casinoManagement.create), fileUpload(supportedFileFormats).fields([{ name: 'mobileImage', maxCount: 1 }, { name: 'desktopImage', maxCount: 1 }]), CasinMoanagementController.createCategory, responseValidationMiddleware(createCategorySchema))
casinoManagementRouter.post('/create-provider', isAuthenticated(resources.casinoManagement.create), fileUpload(supportedFileFormats).fields([{ name: 'mobileImage', maxCount: 1 }, { name: 'desktopImage', maxCount: 1 }]), CasinMoanagementController.createProvider, responseValidationMiddleware(createProviderSchema))
casinoManagementRouter.post('/reorder-provider', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.reorderProvider, responseValidationMiddleware(successSchema))
casinoManagementRouter.post('/reorder-category', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.reorderCategory, responseValidationMiddleware(successSchema))
casinoManagementRouter.post('/reorder-games', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.reorderGames, responseValidationMiddleware(successSchema))
casinoManagementRouter.post('/toggle', isAuthenticated(resources.casinoManagement.toggle_status), CasinMoanagementController.toggle, responseValidationMiddleware(successSchema))
casinoManagementRouter.post('/edit-category', isAuthenticated(resources.casinoManagement.update), fileUpload(supportedFileFormats).fields([{ name: 'mobileImage', maxCount: 1 }, { name: 'desktopImage', maxCount: 1 }]), CasinMoanagementController.editCategory, responseValidationMiddleware(createCategorySchema))
casinoManagementRouter.post('/edit-provider', isAuthenticated(resources.casinoManagement.update), fileUpload(supportedFileFormats).fields([{ name: 'mobileImage', maxCount: 1 }, { name: 'desktopImage', maxCount: 1 }]), CasinMoanagementController.editProvider, responseValidationMiddleware(editProviderSchema))
casinoManagementRouter.post('/edit-aggregator', isAuthenticated(resources.casinoManagement.update), fileUpload(supportedFileFormats).fields([{ name: 'mobileImage', maxCount: 1 }, { name: 'desktopImage', maxCount: 1 }]), CasinMoanagementController.editAggregator, responseValidationMiddleware(editAggregatorSchema))
casinoManagementRouter.post('/edit-game', isAuthenticated(resources.casinoManagement.update), fileUpload(supportedFileFormats).fields([{ name: 'mobileImage', maxCount: 1 }, { name: 'desktopImage', maxCount: 1 }]), CasinMoanagementController.editGame, responseValidationMiddleware(editGameSchema))
casinoManagementRouter.post('/add-games-to-category', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.addGamesCategory, responseValidationMiddleware(successSchema))
casinoManagementRouter.post('/remove-games-from-category', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeGamesFromCategory, responseValidationMiddleware(successSchema))
casinoManagementRouter.post('/remove-restricted-countries-for-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeRestrictedCountryGame, responseValidationMiddleware(editGameSchema))
casinoManagementRouter.post('/remove-restricted-countries-for-provider', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeRestrictedCountryProvider, responseValidationMiddleware(editProviderSchema))
casinoManagementRouter.post('/restrict-countries-for-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.restrictedCountryForGame, responseValidationMiddleware(editGameSchema))
casinoManagementRouter.post('/restrict-countries-for-provider', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.restrictedCountryForProvider, responseValidationMiddleware(editProviderSchema))

casinoManagementRouter.post('/remove-restricted-states-for-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeRestrictedStateGame, responseValidationMiddleware(editGameSchemaStates))
casinoManagementRouter.post('/remove-restricted-states-for-provider', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeRestrictedStateProvider, responseValidationMiddleware(editProviderSchemaStates))
casinoManagementRouter.post('/restrict-states-for-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.restrictedStateForGame, responseValidationMiddleware(editGameSchemaStates))
casinoManagementRouter.post('/restrict-states-for-provider', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.restrictedStateForProvider, responseValidationMiddleware(editProviderSchemaStates))
casinoManagementRouter.post('/toggle-featured-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.toggleFeaturedGame, responseValidationMiddleware(successSchema))

casinoManagementRouter.delete('/delete-category', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.deleteCategory, responseValidationMiddleware(successSchema))
export { casinoManagementRouter }
