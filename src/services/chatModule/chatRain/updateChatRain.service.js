import { ServiceBase } from '@src/libs/serviceBase'
import { appConfig } from '@src/configs'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import axios from 'axios'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    chatRainId: { type: 'number' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    prizeMoney: { type: 'number' },
    currency: { type: 'string' },
    chatGroupId: { type: 'number' }
  },
  required: ['chatRainId']
})
export default class UpdateChatRainService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ChatRainModel = this.context.sequelize.models.chatRain
    const ChatGroupModel = this.context.sequelize.models.chatGroup
    const transaction = this.context.sequelizeTransaction
    const { name, description, prizeMoney, currency, chatGroupId, chatRainId } = this.args
    try {
      if (chatGroupId) {
        const chatGroupExist = await ChatGroupModel.findByPk(chatGroupId)

        if (!chatGroupExist) return this.addError('InvalidChatGroupErrorType')
      }

      const newChatRain = await ChatRainModel.update({ name, description, prizeMoney, currency, chatGroupId }, { where: { id: chatRainId }, transaction })

      const data = JSON.stringify({ chatRainId: newChatRain.chatRainId })

      const reqConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${appConfig.userBackend.endpoint}/api/v1/chat-rain/emit-chat-rain`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }

      // axios.request(reqConfig)
      //   .then((response) => {
      //   })
      //   .catch((error) => {
      // throw new APIError(error)
      //   })

      return { message: SUCCESS_MSG.CREATE_SUCCESS, newChatRain }
    } catch (error) {
      throw new APIError(error)
    }

  }
}
