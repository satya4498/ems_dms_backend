import { sequelize } from '@src/database/models'
import { serverDayjs } from '@src/libs/dayjs'
import _ from 'lodash'
import { Op } from 'sequelize'
import { COLUMNS_TO_EXCLUDE } from '@src/utils/constants/public.constants.utils'
import { Parser } from 'json2csv'
import { PassThrough } from 'stream'

/**
 * @param {string} startDate
 * @param {string} endDate
 * @returns
 */
export function alignDatabaseDateFilter (startDate, endDate) {
  let filterObj = {}
  if (startDate && endDate) filterObj = { [Op.and]: [{ [Op.gte]: serverDayjs(startDate).format() }, { [Op.lte]: serverDayjs(endDate).format() }] }
  else if (endDate) filterObj = { [Op.lte]: serverDayjs(endDate).format() }
  else if (startDate) filterObj = { [Op.gte]: serverDayjs(startDate).format() }

  return filterObj
}

/**
 * @param {Object.<string, string>} names
 */
export async function getLanguageWiseNameJson (newObject, oldObject) {
  _.mapKeys(newObject, (key) => key.toUpperCase())
  _.mapKeys(oldObject, (key) => key.toUpperCase())
  newObject = _.merge(oldObject, newObject)

  const languages = await sequelize.models.language.findAll({ raw: true })
  return languages.reduce((prev, language) => {
    prev[language.code] = newObject[language.code] || newObject.EN || ''
    return prev
  }, {})
}

/**
 * @param {Object.<string, Array>} childPermissions
 * @param {Object.<string, Array>} parentPermissions
 * @returns {Object.<string, Array>}
 */
export function pickChildPermissiosFromParentPermissions (childPermissions, parentPermissions) {
  return _.transform(_.pick(childPermissions, Object.keys(parentPermissions)), (result, value, key) => {
    const intersection = _.intersection(value, parentPermissions[key])
    if (intersection.length) result[key] = intersection
  })
}

/**
 * @param {string} key
 * @param {string?} previousExpireAt
 * @returns
 */
export function getExpireAt (key, previousExpireAt = null) {
  const timeUnit = key.includes('daily') ? 'd' : key.includes('weekly') ? 'w' : key.includes('monthly') ? 'M' : null
  if (!timeUnit) throw Error('Invalid time unit')
  if (!previousExpireAt) return serverDayjs().add(1, timeUnit).format()
  return serverDayjs().add(serverDayjs().diff(previousExpireAt, timeUnit) + 1, timeUnit).format()
}

/**
 * @param {string} parentAdminId
 * @param {string} childAdminId
 * @param {import('sequelize').Transaction} transaction
 * @returns
 */
export async function checkChild (parentAdminId, childAdminId, transaction) {
  if (!childAdminId || (parentAdminId === childAdminId)) return false
  const child = await sequelize.models.adminUser.findOne({ attributes: ['id', 'parentAdminId'], where: { id: childAdminId }, transaction })
  if (!child) return false
  return (child.parentAdminId === parentAdminId) ? child : await checkChild(parentAdminId, child.parentAdminId)
}

// /**
//  * @param {Object} object
//  * @param {import('express').Response} res
//  */
// export async function configureCsvFile (fileName, object, res) {
//   const data = await json2csv(object)
//   res.setHeader('Content-disposition', `attachment; filename=${fileName}.csv`)
//   res.set('Content-Type', 'text/csv')

//   return data
// }

/**
 * @param {string} fileName
 */
export function migrationsTimestamp (fileName) {
  const parts = _.split(fileName, '-')
  const timestamp = _.parseInt(parts[0], 10)
  return _.isFinite(timestamp) ? timestamp : 0
}

/**
 * @param {array} data
 * @param {string} reportType
 */
export function filterColumns (data, reportType) {
  const excluded = COLUMNS_TO_EXCLUDE[reportType] || []
  return data.map(item => {
    const newItem = { ...item }
    excluded.forEach(key => {
      delete newItem[key]
    })
    return newItem
  })
}

/**
 * Generate CSV file and send it as a response.
 * @param {string} fileName - Name of the CSV file.
 * @param {Array<Object>} data - Array of objects to convert into CSV.
 * @param {import('express').Response} res - Express response object.
 */
export function configureCsvFile (fileName, data, res) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'No data available for CSV export' })
    }

    // Set CSV Headers
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`)
    res.setHeader('Content-Type', 'text/csv')

    // Convert JSON to CSV
    const json2csvParser = new Parser()
    const csvData = json2csvParser.parse(data)

    // Stream the data (non-blocking)
    const stream = new PassThrough()
    stream.pipe(res)
    stream.write(csvData)
    stream.end()
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate CSV' })
    throw error
  }
}
