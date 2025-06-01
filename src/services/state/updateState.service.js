import { APIError } from '@src/errors/api.error'
import { populateStatesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    stateId: { type: 'string' },
    languageId: { type: 'string' },
    name: { type: 'string' }
  },
  required: ['stateId']
})

export class UpdateStateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {name,stateId,languageId} = this.args

    try {
      const state = await this.context.sequelize.models.state.findOne({ where: { id: stateId } })
      if (!state) return this.addError('StateNotFoundErrorType')

      if (name) state.name = name
      if (languageId) {
        const language = await this.context.sequelize.models.language.findOne({ where: { id: languageId } })
        if (!language) return this.addError('LanguageNotFoundErrorType')
        state.languageId = language.id
      }

      await state.save()
      await populateStatesCache()
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
