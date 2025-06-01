// 3rd party libs
import { ServiceBase } from '@src/libs/serviceBase'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import { Op } from 'sequelize'
import ajv from '@src/libs/ajv'

// constants
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchMessage: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    chatGroupId: { type: 'string' },
    fromDate: { type: 'string', format: 'date' },
    toDate: { type: 'string', format: 'date' },
    userId: { type: 'string' }
  },
  required: ['userId']
})
export default class GetUserMessageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const MessagesModel = this.context.sequelize.models.message
    const transaction = this.context.sequelizeTransaction
    const { perPage, page, chatGroupId, userId, fromDate, toDate, searchMessage } = this.args

    try {
      // default query
      let query = { actioneeId: userId }

      // filter of user id
      if (chatGroupId) query = { ...query, chatGroupId }

      if (searchMessage) query = { ...query, message: { [Op.iLike]: `%\\${searchMessage}%` } }

      // filter messages with date
      if (fromDate || toDate) {
        query.createdAt = alignDatabaseDateFilter(fromDate, toDate)
      }

      // get all messages of group
      const records = await MessagesModel.findAndCountAll({
        where: { ...query },
        attributes: ['id', 'message', 'actioneeId', ['message_binary', 'gif'], 'messageType', 'status', 'isContainOffensiveWord', 'createdAt'],
        transaction,
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: ((page - 1) * perPage)
      })

      return { records: records.rows, page, totalPages: Math.ceil(records.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
