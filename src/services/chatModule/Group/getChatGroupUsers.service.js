
// import ajv from '../../libs/ajv'

// libs
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import ajv from '@src/libs/ajv'
// constants
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    chatGroupId: { type: 'string' },
    userId: { type: 'number' }
  },
  required: ['chatGroupId']
})

export default class GetChatGroupUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { perPage, page, chatGroupId, search, userId } = this.args
    const UserModel = this.context.sequelize.models.user
    const UserChatGroupModel = this.context.sequelize.models.userChatGroup
    const transaction = this.context.sequelizeTransaction
    try {
      // default query
      let query = {}

      if (search) query = { ...query, username: { [Op.iLike]: `${search}%` } }
      if (userId) query = { ...query, userId: { [Op.not]: userId } }

      // get all groups
      const allUsers = await UserModel.findAndCountAll({
        where: query,
        attributes: ["id", "firstName", "lastName", "email", "createdAt"],
        include: [{
          model: UserChatGroupModel,
          where: { chatGroupId },
          required: true,
          attributes: []
        }],
        transaction,
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: ((page - 1) * perPage),
      })

      return { users: allUsers.rows, page, totalPages: Math.ceil(allUsers.count / perPage) }
    }
    catch (error) {
      throw new APIError(error)
    }
  }
}
