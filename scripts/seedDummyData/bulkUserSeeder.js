const { appConfig } = require('@src/configs')
const bcrypt = require('bcrypt')
import { Faker, es } from '@faker-js/faker'
import { serverDayjs } from '@src/libs/dayjs'
import path from 'path'
const { sequelize } = require('../../src/database/models')
const customFaker = new Faker({ locale: [es] })
const { Worker } = require('worker_threads');
sequelize.options.logging = false




export async function createBulkFakeUsers (count, timeFrame) {

  try {

    const countries = (await sequelize.models.country.findAll({ attributes: ['id'], raw: true })).map(record => record.id)
    const currencies = await sequelize.models.currency.findAll({ attributes: ['id', 'isDefault'], raw: true })
    const data = []
    const promises = []
    console.time('USERS DONE')
    for (let index = 0; index < 10; index++) {

      const promise = new Promise(resolve => {
        console.log(timeFrame, "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        const worker = new Worker(path.resolve(__dirname, './usersWorker.js'), { workerData: { count: parseInt(count / 10), timeFrame } });

        worker.on('message', async (data) => {
          console.log('DONE USER WORKER', worker.threadId, data)
        })

        worker.on('exit', async () => {
          resolve()
        })
      })
      promises.push(promise)

      const date = customFaker.date.between({ from: (new serverDayjs).subtract(4, 'month').valueOf(), to: (new serverDayjs).subtract(2, 'month').valueOf() })
      const encryptedPassword = await bcrypt.hash(btoa('Gamma@312'), appConfig.bcrypt.salt) // Generate random password
      const countryId = customFaker.helpers.arrayElement(countries) // Random country ID
      const ipAddress = customFaker.internet.ip() // Random IP address
      const lastName = `demo${index}-${index + 100}`
      const firstName = customFaker.person.lastName()
      const email = `demo${index}@gmail.com`
      const username = `demo${index}`
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
    const users = await sequelize.models.user.bulkCreate(data, {
      updateOnDuplicate: ['firstName', 'lastName', 'gender']
    })

    for (const user of users) {
      for (const currency of currencies) {
        await sequelize.models.wallet.upsert({
          currencyId: currency.id,
          isDefault: currency.isDefault,
          userId: user.id
        })
      }
    }
    await Promise.all(promises)
    console.timeEnd('USERS DONE')

  } catch (error) {
    console.log(error)
  }
  return true
}


// createBulkFakeUsers(10).then((users) => {
//   console.log('Bulk fake users created:', users)
//   return
// }).catch((error) => {
//   console.error('Error creating bulk fake users:', error)
//   return
// })
