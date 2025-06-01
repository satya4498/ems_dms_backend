import { CountryController } from '@src/rest-resources/controllers/settings/country.controller'
import { CurrencyController } from '@src/rest-resources/controllers/settings/currency.controller'
import { LanguageController } from '@src/rest-resources/controllers/settings/language.controller'
import { SettingController } from '@src/rest-resources/controllers/settings/setting.controller'
import { StateController } from '@src/rest-resources/controllers/settings/state.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { getApplicationSettingsSchema } from '@src/schema/settings/applicationSettings.schema'
import { getCountriesSchema } from '@src/schema/settings/countries.schema'
import { getStatesSchema } from '@src/schema/settings/states.schema'
import { resources } from '@src/utils/constants/permission.constant'
import { getCurrenciesSchema } from '@src/schema/settings/getCurrencies.schema'
import { getLanguagesSchema } from '@src/schema/settings/getLanguages.schema'
import { successSchema } from '@src/schema/successResponse.schema'
import { updateCurrencyResponseSchema } from '@src/schema/settings/updateCurrency,schema'
import express from 'express'

const settingsRoutes = express.Router({ mergeParams: true })

// GET REQUESTS
settingsRoutes.get('/application', SettingController.getSettings, responseValidationMiddleware(getApplicationSettingsSchema))
settingsRoutes.get('/countries', isAuthenticated(), CountryController.getCountries, responseValidationMiddleware(getCountriesSchema))
settingsRoutes.get('/states', isAuthenticated(resources.state.read), StateController.getSates, responseValidationMiddleware(getStatesSchema))
settingsRoutes.get('/languages', isAuthenticated(), LanguageController.getLanguages, responseValidationMiddleware(getLanguagesSchema))
settingsRoutes.get('/currencies', isAuthenticated(resources.coin.read), CurrencyController.getCurrencies, responseValidationMiddleware(getCurrenciesSchema))

// POST REQUESTS
settingsRoutes.post('/application/update-logo', isAuthenticated(resources.applicationSetting.update), fileUpload(['png', 'svg', 'jpeg']).single('file'), SettingController.updateLogo, responseValidationMiddleware(successSchema))
settingsRoutes.post('/application/toggle', isAuthenticated(resources.applicationSetting.toggle_status), SettingController.toggleSettings, responseValidationMiddleware(successSchema))
settingsRoutes.post('/application/update-constants', isAuthenticated(resources.applicationSetting.update), SettingController.updateConstantSettings, responseValidationMiddleware(successSchema))
settingsRoutes.post('/application/update-value-comparisons', isAuthenticated(resources.applicationSetting.update), SettingController.updateValueComparisonSettings, responseValidationMiddleware(successSchema))
settingsRoutes.post('/country/update', isAuthenticated(), CountryController.updateCountry, responseValidationMiddleware(successSchema))
settingsRoutes.post('/country/toggle', isAuthenticated(), CountryController.toggleCountry, responseValidationMiddleware(successSchema))
settingsRoutes.post('/state/update', isAuthenticated(resources.state.update), StateController.updateState, responseValidationMiddleware(successSchema))
settingsRoutes.post('/state/toggle', isAuthenticated(resources.state.toggle_status), StateController.toggleState, responseValidationMiddleware(successSchema))
settingsRoutes.post('/currency/create', isAuthenticated(resources.coin.create), databaseTransactionHandlerMiddleware, CurrencyController.createCurrency, responseValidationMiddleware(updateCurrencyResponseSchema))
settingsRoutes.post('/currency/update', isAuthenticated(resources.coin.update), databaseTransactionHandlerMiddleware, CurrencyController.updateCurrency, responseValidationMiddleware(updateCurrencyResponseSchema))
settingsRoutes.post('/currency/toggle', isAuthenticated(resources.coin.toggle_status), CurrencyController.toggleCurrency, responseValidationMiddleware(successSchema))
settingsRoutes.post('/currency/set-default', isAuthenticated(resources.coin.update), databaseTransactionHandlerMiddleware, CurrencyController.setDefaultCurrency, responseValidationMiddleware(successSchema))
settingsRoutes.post('/language/toggle', isAuthenticated(), LanguageController.toggleLanguage, responseValidationMiddleware(successSchema))

export { settingsRoutes }
