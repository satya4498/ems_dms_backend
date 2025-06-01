import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    isActive: { type: 'boolean' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 }
  }
})

export class GetAllNotificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, search, isActive, perPage } = this.args
    const where = {}
    try {
      if (isActive) where.isActive = _.isBoolean(isActive)
      if (search) where.title = { EN: { [Op.iLike]: `%${search}%` } }

      const notification = await this.context.sequelize.models.notification.findAndCountAll({
        attributes: { exclude: ['updatedAt'] },
        where,
        include: {
          model: this.context.sequelize.models.userNotification,
          attributes: ['userId'],
          include: {
            model: this.context.sequelize.models.user,
            attributes: ['id', 'username']
          }
        },
        limit: perPage,
        offset: (page - 1) * perPage
      })

      return { notification: notification.rows, page, totalPages: Math.ceil(notification.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
