import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
  },
  required: ['id', 'name']
});

export class GetLoyaltyLevelUsers extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const { page, perPage, name } = this.args
    const { context: { sequelizeTransaction: transaction, models: { user: UserModel, tag: tagModel, userTag: UserTagsModel } } } = this
    try {
      const tag = await tagModel.findOne({
        where: { tag: name }
      })

      const users = await UserModel.findAndCountAll({
        attributes: { exclude: ['updatedAt', 'password'] },
        include: [{
          model: UserTagsModel,
          where :{
            tagId: tag.id
          },
          required: true
        }],
        limit: perPage,
        offset: (page - 1) * perPage,
      })

      return { users: users.rows, page, totalPages: Math.ceil(users.count / perPage) }

    } catch (error) {
      throw new APIError(error)
    }
  }
}
