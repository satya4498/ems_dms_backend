import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
const payload = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    limit: { type: 'number', minimum: 1, maximum: 1000, default: 10 }
  },
  required: []
})

export class GetPayoutService extends ServiceBase {
  get constraints () {
    return payload
  }

  async run () {
    const { page, limit } = this.args
    const offset = (page - 1) * limit
    const { payoutQrCode } = this.context.models
    const { count, rows } = await payoutQrCode.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    })
    return {
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit)
      }
    }
  }
}
