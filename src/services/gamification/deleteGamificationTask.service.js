import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    taskId: { type: 'number' }
  },
  required: ['taskId']
})

export class DeleteGamificationTaskService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { taskId } = this.args
    const { gamificationTask: gamificationTaskModel, gamificationTaskGame: gamificationTaskGameModel } = this.context.sequelize.models

    try {
      const task = await gamificationTaskModel.findOne({ where: { id: taskId } })
      if (!task) {
        return this.addError('TaskNotFoundError')
      }

      await gamificationTaskGameModel.destroy({ where: { taskId }, transaction })

      await gamificationTaskModel.destroy({ where: { id: taskId }, transaction })

      return { success: true, message: 'Gamification task deleted successfully.' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
