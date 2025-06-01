import { appConfig } from '@src/configs'
import { messages } from '@src/utils/constants/error.constants'
import { Axios } from 'axios'

export class ApprovelyAxios extends Axios {
  constructor(userId) {
    super({
      baseURL: `${appConfig.approvely.url}`,
      headers: {
        'Content-Type': 'application/json',
        'x-coinflow-auth-user-id': userId + '',
        Authorization: appConfig.approvely.secret
      },
    })
  }

  /**
   * @param body
   * @returns
   */
  static async withdrawTransaction(userId,body) {
    try {
      const axiosInstance = new ApprovelyAxios(userId)
      const response = await axiosInstance.post('/api/merchant/withdraws/payout/delegated', JSON.stringify(body))
      if (response.status !== 200) throw response.data
      return JSON.parse(response.data)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

}
