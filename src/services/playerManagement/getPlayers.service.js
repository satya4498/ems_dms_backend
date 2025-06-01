import { APIError } from '@src/errors/api.error'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { USER_GENDER } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    userId: { type: 'string' },
    kycStatus: { type: 'boolean' },
    languageId: { type: 'string' },
    dateOfBirth: { type: 'string' },
    searchString: { type: 'string' },
    loggedIn: { type: 'boolean' },
    isActive: { type: 'boolean' },
    countryId: { type: 'string' },
    stateId: { type: 'string' },
    // tagId: { type: 'string' },
    gender: { enum: Object.values(USER_GENDER) },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'username', 'email', 'phone', 'dateOfBirth', 'createdAt'], default: 'id' },
    tagIds: { type: 'string' }
  }
})

export class GetPlayersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { kycStatus, languageId, dateOfBirth, searchString, loggedIn, isActive, gender, page, perPage, userId, countryId, stateId, fromDate, toDate, tagIds } = this.args
    // const tagId = this.args.tagId

    try {
      const where = {}

      if (userId) where.id = userId
      if (languageId) where.languageId = languageId
      if (dateOfBirth) where.dateOfBirth = dateOfBirth
      if (_.isBoolean(loggedIn)) where.loggedIn = loggedIn
      if (_.isBoolean(isActive)) where.isActive = isActive
      if (_.isBoolean(kycStatus)) where.kycStatus = kycStatus
      if (countryId) where.countryId = countryId
      if (stateId) where.stateId = stateId
      if (gender) where.gender = gender
      if (searchString) {
        const finalSearchString = `%${searchString}%`
        where[Op.or] = [
          Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'iLike', finalSearchString),
          { username: { [Op.like]: finalSearchString } },
          { email: { [Op.like]: finalSearchString } },
          { phone: { [Op.like]: finalSearchString } }
        ]
      }
      if (fromDate || toDate) {
        const dateFilter = alignDatabaseDateFilter(fromDate, toDate)
        where.createdAt = dateFilter
      }
      let whereTag
      if (tagIds) whereTag = { tagId: { [Op.in]: tagIds.split(',') } }
      const include = [{
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        model: this.context.sequelize.models.country
      }, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        model: this.context.sequelize.models.userTag,
        where: whereTag
      },
      {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        model: this.context.sequelize.models.state
      },
      {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        model: this.context.sequelize.models.userMetaData
      }
      ]
      const users = await this.context.sequelize.models.user.findAndCountAll({
        attributes: { exclude: ['updatedAt', 'password'] },
        where,
        include: include,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]],
        distinct: true
      })

      return { users: users.rows, page, totalPages: Math.ceil(users.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
