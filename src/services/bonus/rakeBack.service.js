import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { ServiceBase } from '@src/libs/serviceBase'
import { USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import { SWEEPS_COINS, SWEEPS_COINS_ID } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonus: { type: 'object' },
    currencyDetails: { type: 'array' }
  },
  required: ['bonus', 'currencyDetails']
})

export class RakeBackBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { args: { currencyDetails, bonus }, context: { sequelizeTransaction: transaction, models: { user: UserModel, userBonus: userBonusModel, userTag: UserTagsModel } } } = this

      const include = []

      // if there are tagIds
      if (!_.isEmpty(bonus.tagIds)) {
        include.push({
          model: UserTagsModel,
          required: true,
          where: { tagId: { [Op.in]: bonus.tagIds } }
        })
      }

      // get all the users according to tagids
      const allUsers = await UserModel.findAll({
        where: { isActive: true },
        include,
        transaction
      })

      // if no users length
      if (!allUsers.length) return this.addError('NoUsersExistsErrorType')

      // will bulk create
      const userBonuses = []
      let gcRakeBackAmount, scRakeBackAmount, wageringAmount

      SWEEPS_COINS
      if (currencyDetails[0].currencyId === SWEEPS_COINS_ID.GC) {
        gcRakeBackAmount = currencyDetails[0].metaData.rakeBackAmount
        scRakeBackAmount = currencyDetails[1]?.metaData.rakeBackAmount
        wageringAmount = currencyDetails[1]?.wageringAmount
      } else {
        gcRakeBackAmount = currencyDetails[1]?.metaData.rakeBackAmount
        scRakeBackAmount = currencyDetails[0].metaData.rakeBackAmount
        wageringAmount = currencyDetails[0].wageringAmount
      }

      // Iterate over all users
      allUsers.forEach(user => {
        userBonuses.push({
          bonusId: bonus.id,
          userId: user.id,
          status: USER_BONUS_STATUS_VALUES.ACTIVE,
          wageredAmount: 0,
          amountToWager: wageringAmount,
          expireAt: bonus?.daysToClear ? dayjs().add(bonus?.daysToClear, 'day').toDate() : null,
          metaData: {
            [SWEEPS_COINS.GC]: NumberPrecision.divide(gcRakeBackAmount / allUsers.length) || 0,
            [SWEEPS_COINS.BSC]: NumberPrecision.divide(scRakeBackAmount / allUsers.length) || 0
          }
        })
      })

      // Perform bulk insert
      await userBonusModel.bulkCreate(userBonuses, { transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
