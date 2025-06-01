import { ServiceBase } from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'number' },
  },
  required: ['id']
})
export default class DeleteOffensiveWordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const OffensiveWordModel = this.context.sequelize.models.offensiveWord
    const transaction = this.context.sequelizeTransaction

    const { id } = this.args

    const checkWord = await OffensiveWordModel.findByPk(id)
    if (!checkWord) return this.addError('OffensiveWordNotFoundErrorType')

    await OffensiveWordModel.destroy({
      where: {
        id
      }
    },
      { transaction })
    return { message: SUCCESS_MSG.DELETE_SUCCESS }
  }
}
