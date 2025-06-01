import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userIds: { type: 'array' },
    isActive: { type: 'boolean', default: true }
  },
  required: ['userIds']
})

export class TogglePlayerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const isActive = this.args.isActive
      const user = await sequelize.models.user.findAll({
        attributes: ['id', 'isActive', 'emailVerified'],
        where: { id: this.args.userIds },
        include:{
          model: sequelize.models.userMetaData,
        }
      })

      if (user.length === 0) return this.addError('UserDoesNotExistsErrorType')
      await sequelize.models.user.update(
        { isActive: isActive},
        {
          where: { id: { [Op.in]: this.args.userIds } }
        }
      )
      if (!isActive) {
        const userMetaDataUpdates = user.map(async (user) => {
          const userMetaData = await sequelize.models.userMetaData.findOne({
            where: { userId: user.id },
          });
  
          if (!userMetaData) {
            return sequelize.models.userMetaData.create({
              userId: user.id,
              lastAccountDeactivatedAt: new Date(),
            });
          } else {
            return sequelize.models.userMetaData.update(
              { lastAccountDeactivatedAt: new Date() },
              { where: { userId: user.id } }
            );
          }
        });
        await Promise.all(userMetaDataUpdates)
      }
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
