import { ServiceBase } from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    word: { type: 'string' }
  },
  required: ['word']
})
export default class CreateOffensiveWordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const OffensiveWordModel = this.context.sequelize.models.offensiveWord
    const transaction = this.context.sequelizeTransaction

    const { word } = this.args

    const checkWord = await OffensiveWordModel.findOne({
      where: {
        word
      }
    })

    if (checkWord) return this.addError('OffensiveWordAlreadyExistErrorType')

    await OffensiveWordModel.create({ word }, { transaction })
    return { message: SUCCESS_MSG.CREATE_SUCCESS, word }
  }
}
