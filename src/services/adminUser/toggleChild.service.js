import { APIError } from '@src/errors/api.error'
import { checkChild } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    parentAdminId: { type: 'string' },
    childAdminId: { type: 'string' }
  },
  required: ['childAdminId']
})

export class ToggleChildService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const isChild = await checkChild(this.args.parentAdminId, this.args.childAdminId)
      if (!isChild) return this.addError('ChildAdminUserNotFoundErrorType')

      const childAdmiUser = await this.context.sequelize.models.adminUser.findOne({ where: { id: this.args.childAdminId } })
      childAdmiUser.isActive = !childAdmiUser.isActive
      // await Cache.del(`admin:${this.args.childAdminId }`)
      await childAdmiUser.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
