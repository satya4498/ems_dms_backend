import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import {QueryTypes } from 'sequelize'
import { SEGMENT_CATEGORIES, SQL_OPERATORS, formatSQLValue, emailTemplate } from '@src/utils/constants/segmentation.constants.utils'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
// import { S3FolderHierarchy } from '@src/utils/constants/app.constant'
// import { deleteFile, uploadFile } from '@src/libs/s3'
import { sendEmail } from '@src/libs/emailSender'
import dayjs from 'dayjs'
import {Parser} from 'json2csv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    searchString: { type: 'string' },
    download: { type: 'boolean', default: false },
    email: { type: 'string'},
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    isAdvancedFilter: { type: 'boolean', default: false },
    advancedFilterConditions: {
      type: 'array',
      items: {
        type: 'object',
      }
    },
  },
  required: ['id', 'page', 'perPage']
})

/**
 *  get all segmentations
 */
export class GetSegmentationUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { args: { id, page, perPage, searchString, isAdvancedFilter = false, advancedFilterConditions, download, email },
      context: { models: { segmentation: segmentationModel }, sequelize }
    } = this

    try {
      let condition

      if (isAdvancedFilter) condition = advancedFilterConditions
      else {
        // get the segment
        const segmentations = await segmentationModel.findOne({
          where: { id }
        })
        condition = segmentations.condition
      }



      // Build query parts
      const selectAggregates = [];
      const havingConditions = [];
      const whereConditions = [];
      const groupByColumn = []
      const tables = []
      if (searchString) whereConditions.push(`users.username ILIKE '%${searchString}%' OR users.email ILIKE '%${searchString}%'`)

      // conditions
      condition.forEach(conditionGroup => {
        // for each condition group
        const orConditions = Object.keys(conditionGroup).map((segment) => {

          // segment details
          const segmentDetails = SEGMENT_CATEGORIES[segment]
          const { queryType, purpose = 'Withdraw', filterColumn: column, lType,value} = segmentDetails
          const { op, value1, value2 } = conditionGroup[segment]
          const dataType = value
          const formattedValue = value1 ? formatSQLValue(value1,dataType) : value1
          const formattedValue2 = value2 ? formatSQLValue(value2,dataType) : value2

          if (queryType === 'aggregate') {

            if (lType == 'credit') {
              const aggregateField = `SUM(case when ledgers.purpose = '${purpose}' then ledgers.amount else 0 END) AS redeem_amount`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`;
              }

            }

            if (lType == 'debit') {
              const aggregateField = `SUM(case when ledgers.purpose = '${purpose}' then ledgers.amount else 0 END) AS purchase_amount`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              // Add condition to HAVING clause
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`;
              }
            }
            if (lType == 'wager') {
              const aggregateField = `SUM(case when ledgers.purpose = '${purpose}' then ledgers.amount else 0 END) AS wagering_amount`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              // Add condition to HAVING clause
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`;
              }
            }
            if (lType === 'signup') {
              // Add condition to WHERE clause
              const aggregateField = `users.created_at AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} DATE (NOW() - INTERVAL '${formattedValue2} day') AND DATE (NOW() - INTERVAL '${formattedValue} day')`;
              } else {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} ${formattedValue? `DATE (NOW() - INTERVAL '${formattedValue} day')`: `${formattedValue}`}`;
              }
            }
            if (lType === 'gross_gaming_revenue') {
              // Add condition to WHERE clause
              const aggregateField = `(SUM(case when ledgers.purpose = '${LEDGER_PURPOSE.CASINO_BET}' then ledgers.amount else 0 END)-SUM(case when ledgers.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' then ledgers.amount else 0 END)) AS gross_gaming_revenue`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              // Add condition to HAVING clause
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`;
              }
            }
            if (lType === 'wagering_count') {
              // Add condition to WHERE clause
              const aggregateField = `COUNT(case when ledgers.purpose = '${LEDGER_PURPOSE.CASINO_BET}' then ledgers.amount END) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`;
              }
            }
            if (lType === 'purchase_count') {
              // Add condition to WHERE clause
              const aggregateField = `COUNT(case when ledgers.purpose = '${LEDGER_PURPOSE.PURCHASE}' then ledgers.amount END) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`;
              }
            }
            if (lType === 'redeem_count') {
              // Add condition to WHERE clause
              const aggregateField = `COUNT(case when ledgers.purpose = '${LEDGER_PURPOSE.REDEEM}' then ledgers.amount END) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`;
              }
            }
            if (lType === 'winning_amount') {
              // Add condition to WHERE clause
              const aggregateField = `SUM(case when ledgers.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' then ledgers.amount else 0 END) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`;
              }
            }
            if (lType === 'last_login') {
              // Add condition to WHERE clause
              const aggregateField = `users.logged_in_at AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} DATE (NOW() - INTERVAL '${formattedValue2} day') AND DATE (NOW() - INTERVAL '${formattedValue} day')`;
              } else {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} ${formattedValue? `DATE (NOW() - INTERVAL '${formattedValue} day')`: `${formattedValue}`}`;
              }
            }
            if (lType === 'last_played') {
              // Add condition to WHERE clause
              const aggregateField = `MIN(ledgers.created_at) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} DATE (NOW() - INTERVAL '${formattedValue2} day') AND DATE (NOW() - INTERVAL '${formattedValue} day')`;
              } else {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} ${formattedValue? `DATE (NOW() - INTERVAL '${formattedValue} day')`: `${formattedValue}`}`;
              }
            }
          }
          else if (queryType === 'single') {
            const aggregateField = `${column}`

            if (lType === 'age') {
              const aggregateField = `DATE_PART('year',AGE(NOW(), users.date_of_birth)) AS age`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);

              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} `;
              }
            } else if (lType === 'country') {
              const aggregateField = `users.country_id AS country_id`
              const countryField = `countries.name AS country`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`);
                selectAggregates.push(`${countryField}`);
                groupByColumn.push(`${countryField.split('AS')[0]}`);
              }
              if (['IN', 'NOT IN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} (${formattedValue.join(',')})`;
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} `;
              }
            }
            else {
              if (!selectAggregates.includes(aggregateField)) {

                selectAggregates.push(`${aggregateField}`);
                groupByColumn.push(`${aggregateField}`)
              }

              // Add condition to HAVING clause
              return `${aggregateField} ${SQL_OPERATORS[op]} ${formattedValue}`;
            }
          }

          return
        })
        // Combine OR conditions for this group
        havingConditions.push(`(${orConditions.join(' OR ')})`);
      });
      if (download) {
      try{
        const queryString = `
        SELECT
          users.id,
          users.email,
          users.username,
          users.first_name,
          users.last_name
          ${selectAggregates.length > 0 ? ',' : ''}
          ${selectAggregates.join(', ')}
        FROM public.users
        left JOIN public.wallets on users.id = wallets.user_id
        LEFT JOIN public.countries on users.country_id = countries.id
        LEFT JOIN public.ledgers ON
        ledgers.from_wallet_id = wallets.id
        OR
        ledgers.to_wallet_id = wallets.id
        ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
        GROUP BY users.id, users.email, users.username, users.first_name, users.last_name ${groupByColumn.length > 0 ? ',' : ''}
        ${groupByColumn.join(' , ')}
        HAVING ${havingConditions.join(' AND ')} ;`;

        const results = await sequelize.query(queryString, {
          type: QueryTypes.SELECT,
          raw: true
        });
        const parser = new Parser()
        const segmentationFile =  parser.parse(results)
        const bufferData = Buffer.from(segmentationFile, 'utf8')

      //  const fileLocation = await uploadFile(bufferData, {
      //     name: `segmentation_advance_filter_${dayjs().format('YYYYMMDD_HHmmss')}.csv`,
      //     mimetype: 'text/csv',
      //     filePathInS3Bucket: S3FolderHierarchy.segmentation
      //   })
          const attachment = {
            filename: `players_list_${dayjs().format('YYYYMMDD_HHmmss')}.csv`,
            content: bufferData,
            contentType: 'text/csv'
          }
          const emailSent = await sendEmail(email,'Arc Sweep','Player Report for Arc Sweep',emailTemplate,attachment)
          return emailSent
      }
      catch(error){
        throw new APIError(error)
      }
      }
      const query = `
        SELECT
          users.id,
          users.email,
          users.username,
          users.first_name,
          users.last_name,
          COUNT(*) OVER() AS total_count
          ${selectAggregates.length > 0 ? ',' : ''}
          ${selectAggregates.join(', ')}
        FROM public.users
        left JOIN public.wallets on users.id = wallets.user_id
        LEFT JOIN public.countries on users.country_id = countries.id
        LEFT JOIN public.ledgers ON
        ledgers.from_wallet_id = wallets.id
        OR
        ledgers.to_wallet_id = wallets.id
        ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
        GROUP BY users.id, users.email, users.username, users.first_name, users.last_name ${groupByColumn.length > 0 ? ',' : ''}
        ${groupByColumn.join(' , ')}
        HAVING ${havingConditions.join(' AND ')}
        LIMIT ${perPage}
        OFFSET ${(page - 1) * perPage}
      ;`;

      const results = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      });

      const count = results.length > 0 ? Number(results[0]?.total_count) : 0

      return { success: true, data: results, page, totalPages: Math.ceil(count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
