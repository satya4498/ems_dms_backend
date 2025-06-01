import { ServiceBase } from '@src/libs/serviceBase'
import { appConfig } from '@src/configs'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import axios from 'axios'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    prizeMoney: { type: 'number' },
    currency: { type: 'string' },
    chatGroupId: { type: 'number' }
  },
  required: ['name', 'prizeMoney', 'currency', 'chatGroupId']
})

export default class CreateChatRainService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ChatRainModel = this.context.sequelize.models.chatRain
    const ChatGroupModel = this.context.sequelize.models.chatGroup
    const transaction = this.context.sequelizeTransaction
    const { name, description, prizeMoney, currency, chatGroupId } = this.args
    try {
      const chatGroupExist = await ChatGroupModel.findByPk(chatGroupId)

      if (!chatGroupExist) return this.addError('InvalidChatGroupErrorType')

      const activeChatRainExist = await ChatRainModel.findOne({
        where: {
          chatGroupId,
          isClosed: false
        }
      })
      if (activeChatRainExist) return this.addError('ChatRainAlreadyActiveErrorType')

      const chatRainObj = { name, description, prizeMoney, currencyId: currency, chatGroupId, isClosed: false }

      const newChatRain = await ChatRainModel.create(chatRainObj, { transaction })

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
      //     console.log(JSON.stringify(response.data))
      //   })
      //   .catch((error) => {
      //     throw new APIError(error)
      //   })

      return { message: SUCCESS_MSG.CREATE_SUCCESS, newChatRain }
    } catch (error) {
      throw new APIError(error)
    }

  }
}
