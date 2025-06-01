import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { DOCUMENT_STATUS_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  },
  required: ['adminUserId']
})

export class KycRequestsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { adminUserId, page, perPage } = this.args
    try {
        const users = await this.context.sequelize.models.user.findAndCountAll({
            attributes: ['id', 'email', 'username', 'kycStatus', 'kycRejectDescription','emailVerified','isActive'],
            where: { kycStatus: false},
            include: [{
              attributes: ['code'],
              model: this.context.sequelize.models.language
            }, {
              model: this.context.sequelize.models.document,
              where: { status: DOCUMENT_STATUS_TYPES.PENDING },
              include: {
                attributes: ['name'],
                model: this.context.sequelize.models.documentLabel,
              }
            }],
            limit: perPage,
            offset: (page - 1) * perPage
          });
          
      if (!users) return this.addError('UserDoesNotExistsErrorType')
  
      return { count:users.count, users:users?.rows,  page, totalPages: Math.ceil(users.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
