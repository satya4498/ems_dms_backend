import { appConfig } from '@src/configs'
import { Axios } from 'axios'

export class QueueWorkerAxios extends Axios {
  constructor () {
    super({
      baseURL: `${appConfig.queueWorker.endpoint}/api/v1/internal`,
      auth: {
        username: appConfig.queueWorker.basicAuth.username,
        password: appConfig.queueWorker.basicAuth.password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Schedules jobs for a tournament.
   * @param {string} tournamentId - The ID of the tournament.
   * @param {string} registrationEndDate - The end date of the registration period.
   * @param {string} endDate - The end date of the tournament.
   * @returns {Promise<boolean>} - Returns true if the job is scheduled successfully.
   * @throws {Error} - Throws an error if the service is unavailable.
   */
  static async scheduleJobs (tournamentId, registrationEndDate, endDate) {
    try {
      const queueWorkerAxios = new QueueWorkerAxios()
      const response = await queueWorkerAxios.post('/tournament/add-jobs', JSON.stringify({
        tournamentId, registrationEndDate, endDate
      }))
      if (response.status !== 200) throw response.data.errors
      return true
    } catch (error) {
      throw Error('ServiceUnavailableErrorType')
    }
  }

  /**
   * Schedules jobs for a tournament.
   * @param {Object} payload - The payload to export report.
   * @returns {Promise<boolean>} - Returns true if the job is scheduled successfully.
   * @throws {Error} - Throws an error if the service is unavailable.
   */
  static async scheduleReportExportJobs (payload) {
    try {
      const queueWorkerAxios = new QueueWorkerAxios()
      const response = await queueWorkerAxios.post('/report/export', JSON.stringify(payload))
      if (response.status !== 200) throw response.data.errors
      return { success: true }
    } catch (error) {
      throw Error('ServiceUnavailableErrorType')
    }
  }
}
