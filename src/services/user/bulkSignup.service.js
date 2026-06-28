import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { SignUpService } from '@src/services/user/signUp.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    users: { type: 'array', items: { type: 'object' } }
  },
  required: ['users']
})

export class BulkSignupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { users } = this.args
      const results = await Promise.all(users.map(user => new SignUpService({ ...user }, this.context).run()))
      return results
    } catch (err) {
      throw new APIError(err)
    }
  }
}
