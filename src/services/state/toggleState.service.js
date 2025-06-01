import { APIError } from '@src/errors/api.error'
import { populateStatesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    stateId: { type: 'string' }
  },
  required: ['stateId']
})

export class ToggleStateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { stateId } = this.args

    try {
      const state = await this.context.sequelize.models.state.findOne({ where: { id: stateId } })
      if (!state) return this.addError('StateNotFoundErrorType')

        state.isActive = !state.isActive
      await state.save()

      await populateStatesCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
