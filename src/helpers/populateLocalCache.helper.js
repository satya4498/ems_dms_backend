import { sequelize } from '@src/database/models'
import { Cache } from '@src/libs/cache'
import { Logger } from '@src/libs/logger'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import _ from 'lodash'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'

function settingParser (settingDataType, value) {
  if (settingDataType === SETTING_DATA_TYPES.JSON) return JSON.parse(value)
  if (settingDataType === SETTING_DATA_TYPES.PERCENTAGE) return Number(value)
  if (settingDataType === SETTING_DATA_TYPES.BOOLEAN) return value === 'true'
  return global[_.startCase(settingDataType)](value)
}

export async function populateSettingsCache () {
  const settingModel = sequelize.models.setting
  const settings = await settingModel.findAll({ raw: true })
  const modifiedSettings = settings.reduce((prev, setting) => {
    prev[setting.key] = settingParser(setting.dataType, setting.value)
    return prev
  }, {})

  await Cache.set(CACHE_KEYS.SETTINGS, modifiedSettings)
  Logger.info('Cache', { message: 'Settings cache populated...' })
}

export async function populateCurrenciesCache () {
  const currencies = await sequelize.models.currency.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.CURRENCIES, currencies)
  Logger.info('Cache', { message: 'Currencies cache populated...' })
}

export async function populatePagesCache () {
  const pages = await sequelize.models.page.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.PAGES, pages)
  Logger.info('Cache', { message: 'Pages cache populated...' })
}

export async function populateLanguagesCache () {
  const languages = await sequelize.models.language.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.LANGUAGES, languages)
  Logger.info('Cache', { message: 'Languages cache populated...' })
}

export async function populateCountriesCache () {
  const countries = await sequelize.models.country.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.COUNTRIES, countries)
  Logger.info('Cache', { message: 'Countries cache populated...' })
}
export async function populateStatesCache () {
  const states = await sequelize.models.state.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.STATES, states)
  Logger.info('Cache', { message: 'States cache populated...' })
}
export async function populateSportsCache () {
  const sports = await sequelize.models.sport.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.SPORTS, sports)
  Logger.info('Cache', { message: 'Sports cache populated...' })
}

export async function populateDocumentLabelCache () {
  const documentLabels = await sequelize.models.documentLabel.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
  await Cache.set(CACHE_KEYS.DOCUMENT_LABELS, documentLabels)
  Logger.info('Cache', { message: 'Document labels cache populated...' })
}
