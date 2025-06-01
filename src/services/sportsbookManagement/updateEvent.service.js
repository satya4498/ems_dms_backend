import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { EVENT_STATUS } from '@src/utils/constants/sportbookManagement.constants.js'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    eventId: { type: 'string' },
    status: { enum: Object.values(EVENT_STATUS) },
    bettingEnabled: { type: 'boolean' }
  },
  required: ['eventId']
})

export class UpdateEventService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const status = this.args.status
    const bettingEnabled = this.args.bettingEnabled

    try {
      const event = await this.context.sequelize.models.event.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { id: this.args.eventId }
      })
      if (!event) return this.addError('EventNotFoundErrorType')

      if (status) event.status = status
      if (_.isBoolean(bettingEnabled)) event.bettingEnabled = bettingEnabled

      await event.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
