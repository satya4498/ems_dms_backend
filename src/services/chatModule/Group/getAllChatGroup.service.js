// 3rd party libs
import { ServiceBase } from '@src/libs/serviceBase'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchName: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    status: { type: 'string', enum: ['true', 'false'] },
    fromDate: { type: 'string' },
    toDate: { type: 'string' }
  }
})

export default class GetAllChatGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ChatGroupModel = this.context.sequelize.models.chatGroup
    const transaction = this.context.sequelizeTransaction
    const { perPage, page, searchName, status, fromDate, toDate } = this.args

    try {
      // all conditions
      let query = {}
      if (status && (status !== '' || status !== null)) query = { ...query, status }

      if (searchName) query.name = {
        [Op.iLike]: `%${searchName}%`
      }
      if (fromDate || toDate) {
        query.createdAt = alignDatabaseDateFilter(fromDate, toDate)
      }
      // get all groups
      const allGroups = await ChatGroupModel.findAndCountAll({
        where: query,
        attributes: { exclude: ['admins', 'updated_at'] },
        limit: perPage,
        offset: ((page - 1) * perPage),
        order: [['createdAt', 'DESC']],
        transaction
      })

      return { groups: allGroups.rows, page, totalPages: Math.ceil(allGroups.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
