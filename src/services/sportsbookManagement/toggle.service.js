import { APIError } from '@src/errors/api.error'
import { populateSportsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SPORTSBOOK_ENTITY_TYPES } from '@src/utils/constants/sportbookManagement.constants'

const SPORTSBOOK_ENTITY_TO_ERROR_MESSAGES_MAP = {
  [SPORTSBOOK_ENTITY_TYPES.SPORT]: 'SportNotFoundErrorType',
  [SPORTSBOOK_ENTITY_TYPES.LEAGUE]: 'LeagueNotFoundErrorType',
  [SPORTSBOOK_ENTITY_TYPES.LOCATION]: 'LocationNotFoundErrorType'
}

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { enum: Object.values(SPORTSBOOK_ENTITY_TYPES) }
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
      [SPORTSBOOK_ENTITY_TYPES.SPORT]: this.context.sequelize.models.sport,
      [SPORTSBOOK_ENTITY_TYPES.LEAGUE]: this.context.sequelize.models.league,
      [SPORTSBOOK_ENTITY_TYPES.LOCATION]: this.context.sequelize.models.location
    }

    try {
      const entity = await modelMap[type].findOne({ where: { id: this.args.id } })
      if (!entity) return this.addError(SPORTSBOOK_ENTITY_TO_ERROR_MESSAGES_MAP[type])

      entity.isActive = !entity.isActive
      await entity.save()

      if (type === SPORTSBOOK_ENTITY_TYPES.SPORT) await populateSportsCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
