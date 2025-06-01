import { ServiceBase } from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import _ from 'lodash'
import { Op } from 'sequelize'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    fromDate: { type: 'string', format: 'date' },
    toDate: { type: 'string', format: 'date' }
  }

})
export default class GetOffensiveWordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const OffensiveWordModel = this.context.sequelize.models.offensiveWord
    // const transaction = this.context.sequelizeTransaction

    const { page, perPage, search, fromDate, toDate } = this.args

    const whereCondition = {
      word: (search) ? { [Op.iLike]: `\\${search}%` } : null,
      createdAt: (fromDate && toDate) ? { [Op.between]: [moment(fromDate).startOf('day'), moment(toDate).endOf('day')] } : null
    }

    const filterCondition = _.omitBy(whereCondition, _.isNil)

    const offensiveWords = await OffensiveWordModel.findAndCountAll({
      where: filterCondition,
      order: [['id', 'desc']],
      limit: perPage,
      offset: ((page - 1) * perPage),
    })

    return { offensiveWords: offensiveWords.rows, page, totalPages: Math.ceil(offensiveWords.count / perPage) }
  }
}
