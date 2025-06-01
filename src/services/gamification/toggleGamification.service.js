import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
// import { CASINO_ENTITY_TYPES } from '@src/utils/constants/casinoManagement.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    taskId: { type: 'string' }
  },
  required: ['taskId']
})

export class ToggleGamificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { taskId } = this.args
    const { gamificationTask: gamificationTaskModel } = this.context.sequelize.models

    try {
      const entity = await gamificationTaskModel.findOne({ where: { id: taskId } })
      if (!entity) return this.addError('TaskNotFoundError')

      entity.isActive = !entity.isActive
      await entity.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
