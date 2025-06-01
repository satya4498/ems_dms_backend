import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { createBulkFakeTransaction } from 'scripts/seedDummyData/bankingTransactionSeeder'
import { createBulkFakeUsers } from 'scripts/seedDummyData/bulkUserSeeder'
import { createBulkCasinoTransaction } from 'scripts/seedDummyData/casinoSeeder'
import { issueFakeBonuses } from 'scripts/seedDummyData/issueBonusSeeder'
import { BulkcreateLimitsOfTheUsers } from 'scripts/seedDummyData/seedAllLimits'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    count: { type: 'number', default: 100 },
    users: { enum: ['true', 'false'], default: 'true' },
    banking: { enum: ['true', 'false'], default: 'true' },
    lossing: { enum: ['true', 'false'], default: 'false' },
    type: { type: 'string'}
  }
})

export class PopulateDataService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const count = this.args.count
    const type = this.args.type

    try {
      if(type == 'bonus'){
         await issueFakeBonuses(count, { fromDate: serverDayjs().subtract(2, 'month').valueOf(), toDate: serverDayjs().subtract(1, 'month').valueOf() })
      }
      if(type == 'limits'){
        await BulkcreateLimitsOfTheUsers()
      }
      else{
        await createBulkFakeTransaction(count, { fromDate: serverDayjs().subtract(2, 'month').valueOf(), toDate: serverDayjs().subtract(1, 'month').valueOf() })
        await createBulkFakeTransaction(count, { fromDate: serverDayjs().subtract(1, 'week').valueOf(), toDate: serverDayjs().subtract(1, 'day').valueOf() })
        await createBulkCasinoTransaction(count, { fromDate: serverDayjs().subtract(1, 'week').valueOf(), toDate: serverDayjs().valueOf() })
        await createBulkFakeUsers(10, { fromDate: serverDayjs().subtract(3, 'day').valueOf(), toDate: serverDayjs().valueOf() })
        await createBulkFakeTransaction(count, { fromDate: serverDayjs().subtract(1, 'day').valueOf(), toDate: serverDayjs().valueOf() })
        await createBulkCasinoTransaction(count, { fromDate: serverDayjs().subtract(1, 'week').valueOf(), toDate: serverDayjs().valueOf() })
        await issueFakeBonuses(count, { fromDate: serverDayjs().subtract(2, 'month').valueOf(), toDate: serverDayjs().subtract(1, 'month').valueOf() })
      }

      this.context.sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY daily_statistical_summary;')
      return { messgae: 'data loaded sucessfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
