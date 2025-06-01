const { parentPort, workerData, threadId } = require('worker_threads');
const { sequelize } = require('../../src/database/models')
const { appConfig } = require('@src/configs')
const bcrypt = require('bcrypt')
import { Faker, es } from '@faker-js/faker';
import { serverDayjs } from '@src/libs/dayjs';
const customFaker = new Faker({ locale: [es] });
sequelize.options.logging = false

async function generateUserData(count, timeFrame) {

  const countries = (await sequelize.models.country.findAll({ attributes: ['id'], raw: true })).map(record => record.id)
  const currencies = await sequelize.models.currency.findAll({ attributes: ['id', 'isDefault'], raw: true })
  const data = []

  for (let index = 0; index < count; index++) {
    const date = timeFrame ? customFaker.date.between({ from: timeFrame.fromDate, to: timeFrame.toDate }) : customFaker.date.between({ from: (new serverDayjs).subtract(3, 'month').valueOf(), to: (new serverDayjs).subtract(2, 'month').valueOf() })
    console.log(date, "==========================================", )
    const encryptedPassword = await bcrypt.hash(btoa('Test@123'), appConfig.bcrypt.salt) // Generate random password
    const countryId = customFaker.helpers.arrayElement(countries) // Random country ID
    const ipAddress = customFaker.internet.ip() // Random IP address
    const lastName = customFaker.person.firstName()
    const firstName = customFaker.person.lastName()
    const email = customFaker.internet.email().toLowerCase()
    const username = email.split('@')[0]
    const phone = customFaker.phone.number().replace(' ', '')
    const gender = customFaker.helpers.arrayElement(['male', 'female'])
    const phoneCode = customFaker.helpers.arrayElement(['+1', '+44', '+91']) // Random phone code
    const dateOfBirth = customFaker.date.birthdate()

    data.push({
      kycStatus: false,
      countryId,
      email,
      lastLoggedInIp: ipAddress,
      password: encryptedPassword,
      username,
      emailVerified: true,
      phone: phone || null,
      gender: gender || null,
      lastName: lastName || null,
      firstName: firstName || null,
      phoneCode: phoneCode || null,
      dateOfBirth: dateOfBirth || null,
      createdAt: date,
      updatedAt: date,
      wallets: currencies.map(currency => {
        return {
          currencyId: currency.id,
          isDefault: currency.isDefault,
          createdAt: date,
          updatedAt: date,
        }
      })
    })
  }
  return data
}

async function runner() {
  const transaction = await sequelize.transaction()
  try {
    const data = await generateUserData(workerData.count, workerData.timeFrame)

    await sequelize.models.user.bulkCreate(data, { include: { model: sequelize.models.wallet }, transaction })

    await transaction.commit()
    parentPort.postMessage('users worker finished ' + threadId)
  }
  catch (error) {
    console.log(error)
    await transaction.rollback()
  }

}

console.log('STARTED USERS WORKER', threadId)
runner()
