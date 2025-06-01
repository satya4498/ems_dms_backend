import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'



const constraints = ajv.compile({
  type: 'object',
  properties: {}
})

export class GetKycMethodsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      let kycMethods = await this.context.sequelize.models.kycDetail.findAll()     
      return kycMethods
    } catch (error) {
      throw new APIError(error)
    }
  }
}