import { dayjs, serverDayjs } from '@src/libs/dayjs'
import { REPORT_TIME_PERIOD_FILTER } from './constants/app.constants'

/**
 * @param {?import('dayjs').Dayjs} startDate
 * @param {?import('dayjs').Dayjs} endDate
 * @returns
 */
export function getPastDatesForDeltaCalculations (startDate, endDate) {
  let pastFromDate = null
  let pastToDate = null

  if (startDate && endDate) {
    pastFromDate = dayjs(startDate).subtract(dayjs(endDate).diff(dayjs(startDate), 'hour'), 'hour').utc().format()
    pastToDate = startDate
  }

  return { pastFromDate, pastToDate }
}

export function getReportDates (filter, fromDate, toDate) {
  const today = serverDayjs().endOf('day')
  const startOfToday = today.startOf('day')

  switch (filter) {
    case REPORT_TIME_PERIOD_FILTER.TODAY:
      fromDate = startOfToday.format()
      toDate = today.format()
      break
    case REPORT_TIME_PERIOD_FILTER.YESTERDAY:
      fromDate = startOfToday.subtract(1, 'day')
      toDate = fromDate.endOf('day').format()
      fromDate = fromDate.format()
      break
    case REPORT_TIME_PERIOD_FILTER.LAST_7_DAYS:
      fromDate = today.subtract(7, 'day').format()
      toDate = today.format()
      break
    case REPORT_TIME_PERIOD_FILTER.LAST_30_DAYS:
      fromDate = today.subtract(30, 'day').format()
      toDate = today.format()
      break
    case REPORT_TIME_PERIOD_FILTER.LAST_90_DAYS:
      fromDate = today.subtract(90, 'day').format()
      toDate = today.format()
      break
    case REPORT_TIME_PERIOD_FILTER.MONTH_TO_DATE:
      fromDate = today.startOf('month').format()
      toDate = today.format()
      break
    case REPORT_TIME_PERIOD_FILTER.CUSTOM:
      if (!fromDate) throw Error('fromDate required')
      fromDate = dayjs(fromDate).utc().format()
      toDate = toDate ? dayjs(toDate).utc().format() : dayjs()
      break
    default:
      fromDate = startOfToday.format()
      toDate = today.format()
      break
  }
  return { fromDate, toDate }
}
