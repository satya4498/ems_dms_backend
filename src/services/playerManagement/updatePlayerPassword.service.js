import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { UserBackendAxios } from '@src/libs/axios/userBackend.axios'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'number' },
    newPassword: { type: 'string', format: 'password' }
  },
  required: ['userId', 'newPassword']
})

export class UpdatePlayerPasswordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      await UserBackendAxios.updatePassword(this.args.userId, this.args.newPassword)
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
