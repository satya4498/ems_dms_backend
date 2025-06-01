import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    wageringTemplateId: { type: 'string' },
    name: { type: 'string' },
    gameContributions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          casinoGameId: { type: 'string' },
          contributionPercentage: { type: 'number' }
        }
      }
    }
  },
  required: ['wageringTemplateId', 'gameContributions']
})

export class UpdateWageringTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { wageringTemplateId, name } = this.args

    try {
      
      await this.context.sequelize.models.wageringTemplate.update(
        { name },
        { where: { id: wageringTemplateId } }
      );

      const wageringTemplate = await this.context.sequelize.models.wageringTemplateGameDetail.findAll({
        where: { wageringTemplateId: this.args.wageringTemplateId },
        attributes: ['casinoGameId', 'wageringTemplateId', 'contributionPercentage'],
        raw: true,
        transaction
      })

      const gameContributions = this.args.gameContributions.map((record) => {
        record.wageringTemplateId = this.args.wageringTemplateId
        return record
      })

      const wageringTemplateGameDetailIds = gameContributions.map((record) => record.id).filter((id) => id !== undefined);

      await this.context.sequelize.models.wageringTemplateGameDetail.destroy({
        where: {
          wageringTemplateId: wageringTemplateId,
          id: {
            [Op.notIn]: wageringTemplateGameDetailIds // Deletes items whose IDs are not in the payload
          }
        }
      });

      return await this.context.sequelize.models.wageringTemplateGameDetail.bulkCreate(gameContributions, {
        updateOnDuplicate: ['contributionPercentage'],
        transaction
      })
    } catch (error) {
      throw new APIError(error)
    }
  }
}
