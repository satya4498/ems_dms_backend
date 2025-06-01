import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { QUERY_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    threadId: { type: 'string' },
    status: { enum: Object.values(QUERY_STATUS), default: QUERY_STATUS.ACTIVE }
  },
  required: ['threadId', 'status']
})

export class UpdateDisputeStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const transaction = this.context.sequelizeTransaction
      const mainThread = await this.context.sequelize.models.mainThread.update({
        status: this.args.status
      },
      {
        where: { id: this.args.threadId },
        transaction
      })

      return { mainThread }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
