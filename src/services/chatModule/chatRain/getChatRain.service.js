
// import ajv from '../../libs/ajv'

import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import ajv from '@src/libs/ajv'
import _ from 'lodash'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    status: { type: 'string' },
    fromDate: { type: 'string', format: 'date' },
    toDate: { type: 'string', format: 'date' },
    groupId: { type: 'number' }
  }
})

export default class GetChatRainUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { perPage, page, groupId, search, fromDate, toDate } = this.args
    const ChatRainModel = this.context.sequelize.models.chatRain
    const transaction = this.context.sequelizeTransaction
    const whereCondition = {
      name: (search) ? { [Op.iLike]: `%\\${search}%` } : null,
      chatGroupId: groupId
    }
    if (fromDate || toDate) {
      whereCondition.createdAt = alignDatabaseDateFilter(fromDate, toDate)
    }
    const filterCondition = _.omitBy(whereCondition, _.isNil)

    const chatRains = await ChatRainModel.findAndCountAll({
      where: filterCondition,
      order: [['id', 'desc']],
      limit: perPage,
      offset: ((page - 1) * perPage),
      transaction
    })
    return { chatRains: chatRains.rows, page, totalPages: Math.ceil(chatRains.count / perPage) }
  }
}
