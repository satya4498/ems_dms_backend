import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { Op } from 'sequelize'

// AJV validation schema
const getUsersConstraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    limit: { type: 'number', minimum: 1, maximum: 1000, default: 20 },
    search: { type: 'string', maxLength: 255 }
  }
})

export class GetUsersService extends ServiceBase {
  get constraints () {
    return getUsersConstraints
  }

  async run () {
    try {
      const { page, limit, search = '' } = this.args
      const offset = (page - 1) * limit
      const where = {}
      if (search) {
        where[Op.or] = [
          { '$user.first_name$': { [Op.iLike]: `%${search}%` } },
          { '$user.last_name$': { [Op.iLike]: `%${search}%` } },
          { '$user.phone$': { [Op.iLike]: `%${search}%` } },
          { '$user.email$': { [Op.iLike]: `%${search}%` } }
        ]
      }
      const { rows, count } = await this.context.sequelize.models.user.findAndCountAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      })
      return {
        users: rows,
        total: count,
        page,
        limit
      }
    } catch (err) {
      this.log.error('Get Users Failed', {
        message: err.message,
        context: { args: this.args },
        exception: err
      })
      throw new APIError(err)
    }
  }
}
