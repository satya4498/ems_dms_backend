import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    providerId: { type: 'string' },
    stateCodes: { type: 'array' }
  },
  required: ['providerId', 'stateCodes']
})

export class ProviderRemoveRestrictedStatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { stateCodes, providerId } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const provider = await this.context.sequelize.models.casinoProvider.findOne({ where: { id: providerId }, transaction })
      if (!provider) return this.addError('ProviderNotFoundErrorType')

      const states = await this.context.sequelize.models.state.findOne({
        attributes: [[Sequelize.fn('ARRAY_AGG', Sequelize.col('id')), 'stateIds']],
        where: { code: { [Op.in]: stateCodes } },
        raw: true,
        transaction
      })

      provider.restrictedStates = _.difference(provider.restrictedStates, states.stateIds)
      
      await provider.save({ transaction })

      return { provider }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
