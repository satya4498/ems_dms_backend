import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { CASINO_ENTITY_TYPES } from '@src/utils/constants/casinoManagement.constants'

const CASINO_ENTITY_TO_ERROR_MESSAGES_MAP = {
  [CASINO_ENTITY_TYPES.GAME]: 'GameNotFoundErrorType',
  [CASINO_ENTITY_TYPES.CATEGORY]: 'CategoryNotFoundErrorType',
  [CASINO_ENTITY_TYPES.PROVIDER]: 'ProviderNotFoundErrorType',
  [CASINO_ENTITY_TYPES.AGGREGATOR]: 'AggregatorNotFoundErrorType',
  [CASINO_ENTITY_TYPES.SUB_CATEGORY]: 'SubCategoryNotFoundErrorType'
}

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { enum: Object.values(CASINO_ENTITY_TYPES) }
  },
  required: ['id', 'type']
})

export class ToggleService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const type = this.args.type

    const modelMap = {
      [CASINO_ENTITY_TYPES.GAME]: this.context.sequelize.models.casinoGame,
      [CASINO_ENTITY_TYPES.CATEGORY]: this.context.sequelize.models.casinoCategory,
      [CASINO_ENTITY_TYPES.PROVIDER]: this.context.sequelize.models.casinoProvider,
      [CASINO_ENTITY_TYPES.AGGREGATOR]: this.context.sequelize.models.casinoAggregator
    }

    try {
      const model = modelMap[type]
      const entity = await model.findOne({ where: { id: this.args.id } })
      if (!entity) return this.addError(CASINO_ENTITY_TO_ERROR_MESSAGES_MAP[type])

      entity.isActive = !entity.isActive
      await entity.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
