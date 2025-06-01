import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'



const constraints = ajv.compile({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      isActive: { type: 'boolean' }
    }
  }
})

export class ToggleKycMethodService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const kycMethods = this.args
      const transaction = this.context.sequelizeTransaction
     
      await Promise.all(kycMethods.map(async (kycMethod) => {
        await this.context.sequelize.models.kycDetail.update({
          isActive : kycMethod.isActive
        }, {
          where: { id: kycMethod.id },
          transaction
        })
      }))  

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}