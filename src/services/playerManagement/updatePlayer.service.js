import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { USER_GENDER } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    phoneCode: { type: 'string' },
    gender: { enum: Object.values(USER_GENDER) },
    dateOfBirth: { type: 'string' },
    username: { type: 'string', default: '' },
    countryCode: { type: 'string' },
    city: { type: 'string' },
    zipCode: { type: 'string' },
    address: { type: 'string' }
  },
  required: ['userId']
})

export class UpdatePlayerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const firstName = this.args.firstName
    const lastName = this.args.lastName
    const email = this.args.email
    const phone = this.args.phone
    const phoneCode = this.args.phoneCode
    const gender = this.args.gender
    const dateOfBirth = this.args.dateOfBirth
    const username = this.args.username
    const countryCode = this.args.countryCode
    const city = this.args.city
    const zipCode = this.args.zipCode
    const address = this.args.address
    const transaction = this.context.sequelizeTransaction

    try {
      const player = await this.context.sequelize.models.user.findOne({ where: { id: this.args.userId }, transaction })
      if (!player) return this.addError('UserDoesNotExistsErrorType')

      if (email) {
        const userCount = await this.context.sequelize.models.user.count({ where: { email }, transaction })
        if (!userCount) player.email = email
      }

      if (username) {
        const userCount = await this.context.sequelize.models.user.count({ where: { username }, transaction })
        if (!userCount) player.username = username
      }

      player.firstName = firstName || player.firstName
      player.lastName = lastName || player.lastName
      player.email = email || player.email
      player.phone = phone || player.phone
      player.phoneCode = phoneCode || player.phoneCode
      player.gender = gender || player.gender
      player.dateOfBirth = dateOfBirth || player.dateOfBirth
      player.username = username || player.username

      await player.save({ transaction })
      if (countryCode && city && zipCode) await sequelize.models.address.create({ address, countryCode, city, zipCode, userId: player.id }, { transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
