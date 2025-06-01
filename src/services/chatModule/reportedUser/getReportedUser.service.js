// 3rd party libs
import { ServiceBase } from '@src/libs/serviceBase'
import { omitBy, isNil } from 'lodash'
import sequelize, { Op } from 'sequelize'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

// constants
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    userId: { type: 'string' },
    fromDate: { type: 'string', format: 'date' },
    toDate: { type: 'string', format: 'date' }
  }
})
export default class GetReportedUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const UserModel = this.context.sequelize.models.user
    const ReportedUserModel = this.context.sequelize.models.reportedUser
    const transaction = this.context.sequelizeTransaction
    const { perPage, page, userId, fromDate, toDate, search } = this.args
    const whereCondition = {
      description: (search)
        ? {
          [Op.iLike]: `%\\${search}%`
        }
        : null
    }
    if (fromDate || toDate) {
      whereCondition.createdAt = alignDatabaseDateFilter(fromDate, toDate)
    }

    const filterCondition = omitBy(whereCondition, isNil)
    try {
      const reportedUser = await ReportedUserModel.findAll({
        where: filterCondition,
        attributes: ['reportedUser.reported_user_id', [sequelize.fn('COUNT', sequelize.col('reported_user_id')), 'reportCount']],
        group: ['reportedUser.reported_user_id', 'reportedUsers.id'],
        include: [
          { model: UserModel, as: 'reportedUsers', attributes: ['id', 'email', 'firstName', 'lastName'] }
        ],
        limit: perPage,
        offset: ((page - 1) * perPage),
        transaction
      })
      return { message: SUCCESS_MSG.GET_SUCCESS, reportedUser }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
