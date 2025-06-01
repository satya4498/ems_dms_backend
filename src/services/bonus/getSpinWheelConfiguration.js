import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusType: { type: 'string' },
    wheelConfigurationId: { type: 'string' }
  },
  required: ['bonusType']
})

export class GetSpinWheelConfigurationService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const { bonusType, wheelConfigurationId } = this.args
    const { bonus, wheelDivisionConfiguration, currency, bonusCurrency } = this.context.sequelize.models
    const whereClause = {}
    if (bonusType) whereClause.bonusType = bonusType
    const wheelConfigWhere = wheelConfigurationId ? { id: wheelConfigurationId } : {}

    const wheelConfiguration = await bonus.findAll({
      attributes: ['id', 'bonusType'],
      where: whereClause,
      include: [
        {
          model: wheelDivisionConfiguration,
          exclude: ['createdAt', 'updatedAt'],
          where: wheelConfigWhere,
          as: 'wheelConfigurations',
          required: false
        },
        {
          model: bonusCurrency,
          attributes: ['id'],
          required: false,
          include: [
            {
              model: currency,
              attributes: ['id', 'name', 'code', 'symbol'],
              required: false,
              where: { isActive: true }
            }
          ]
        }
      ],
      order: [[{ model: wheelDivisionConfiguration, as: 'wheelConfigurations' }, 'updatedAt', 'DESC']]
    })
    return {
      success: true,
      data: wheelConfiguration
    }
  }
}
