import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { GetPlayerPerformanceCsvReportService } from './playerStatsCsvReport.service'
import { GetGameCsvReportService } from './getGameCsvReport.service'
import { GetBankingTransactionsCsvReportService } from './getBankingTransactionsCsvReport.service'
import { GetCasinoTransactionsCsvReportService } from './getCasinoTransactionsCsvReport.service'
import { REPORT_TYPES } from '@src/utils/constants/public.constants.utils'
import { QueueWorkerAxios } from '@src/libs/axios/queueWorker.axios'
import { filterColumns } from '@src/helpers/common.helper'
const constraints = ajv.compile({
  type: 'object',
  properties: {
    reportType: { type: 'string', enum: Object.values(REPORT_TYPES) },
    csvDownload: { type: 'boolean', default: false },
    email: { type: 'string' },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    gameName: { type: 'string' },
    currencyId: { type: 'string' },
    searchString: { type: 'string' },
    userId: { type: 'string' },
    tagId: { type: 'string' },
    actioneeId: { type: 'string' },
    page: { type: 'number' },
    status: { type: 'string' },
    purpose: { type: 'string' },
    type: { type: 'string' },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    tagIds: { type: 'string' },
    tab: { type: 'string' },
    dateOptions: { type: 'string' },
    perPage: { type: 'number' },
    orderBy: { type: 'string' },
    gameId: { type: 'string' },
    walletId: { type: 'string' },
    transactionId: { type: 'string' },
    conversionRate: { type: 'number' },
    previousTransactionId: { type: 'string' }
  },
  additionalProperties: true,
  required: ['reportType', 'csvDownload']
})

const reportService = {
  [REPORT_TYPES.GAME_REPORTS]: GetGameCsvReportService,
  [REPORT_TYPES.PLAYER_PERFORMANCE]: GetPlayerPerformanceCsvReportService,
  [REPORT_TYPES.BANKING_TRANSACTIONS]: GetBankingTransactionsCsvReportService,
  [REPORT_TYPES.CASINO_TRANSACTION]: GetCasinoTransactionsCsvReportService
}
const reportServicesResult = {
  [REPORT_TYPES.BANKING_TRANSACTIONS]: 'transactions',
  [REPORT_TYPES.CASINO_TRANSACTION]: 'casinoTransactions',
  [REPORT_TYPES.PLAYER_PERFORMANCE]: 'reportData',
  [REPORT_TYPES.GAME_REPORTS]: 'gameReport'
}

export class ReportService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { reportType, email, csvDownload } = this.args

    try {
      if (!email && csvDownload) {
        const result = await reportService[reportType].execute({ ...this.args }, this.context)
        let data = result?.result[reportServicesResult[reportType]] || []
        data = filterColumns(data, reportType)

        return { file: reportType, data }
      }
      if (email) {
        const response = await QueueWorkerAxios.scheduleReportExportJobs({ ...this.args })
        return response
      }

      return new APIError('Invalid request')
    } catch (error) {
      throw new APIError(error)
    }
  }
}
