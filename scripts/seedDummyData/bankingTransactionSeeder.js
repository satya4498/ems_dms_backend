
import { Faker, es } from '@faker-js/faker';
import _ from 'lodash';
import path from 'path';
const { sequelize } = require('../../src/database/models')
const { Worker } = require('worker_threads');
const customFaker = new Faker({ locale: [es] });

sequelize.options.logging = false



async function createDummyPackages(count = 100) {
  const packages = [];

  for (let i = 0; i < count; i++) {
    const pkg = {
      amount: customFaker.number.float({ min: 10, max: 1000, multipleOf: 1 }),
      lable: customFaker.commerce.productName(),
      gcCoin: customFaker.number.float({ min: 100, max: 1000 }),
      scCoin: customFaker.number.float({ min: 5, max: 50, multipleOf: 1 }),
      isActive: customFaker.datatype.boolean(),
      isVisibleInStore: customFaker.datatype.boolean(),
      imageUrl: customFaker.image.url(),
      orderId: customFaker.number.int({ min: 1, max: 100 }),
      validTill: customFaker.date.future(),
      validFrom: customFaker.date.past(),
      customizationSettings: {
        color: '',
        size: '',
      },
      maxPurchasePerUser: customFaker.number.int({ min: 1, max: 10 }),
      discountAmount: customFaker.number.float({ min: 10, max: 100, multipleOf: 0.01 }),
      discountEndDate: customFaker.date.future(),
      pricingTiers: [
        { threshold: 100, newPrice: customFaker.number.float({ min: 5, max: 50, multipleOf: 0.01 }) },
        { threshold: 500, newPrice: customFaker.number.float({ min: 1, max: 40, multipleOf: 0.01 }) }
      ],
      bonusId: null,  // Set bonusId if required
      giftable: customFaker.datatype.boolean(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    packages.push(pkg);
  }

  try {
    await sequelize.models.package.bulkCreate(packages);
    console.log(`${count} dummy packages inserted successfully.`);
  } catch (error) {
    console.error('Error inserting dummy packages:', error);
  }
}




export async function createBulkFakeTransaction(count, timePeriod) {

  createDummyPackages(20)
  const users = await sequelize.models.user.findAll({
    attributes: ['id']
  })

  const packages = await sequelize.models.package.findAll({
    attributes: ['id', 'amount']
  })


  try {
    const chunkedUsers = _.chunk(users, parseInt(users.length / 10))

    const promises = chunkedUsers.map(async users => {

      return new Promise(resolve => {

        const convertedUsers = users.map(user => {
          return user.dataValues
        })

        const worker = new Worker(path.resolve(__dirname, './bankingWorker.js'), { workerData: { convertedUsers, count, timePeriod, packages } });

        worker.on('message', async (data) => {
          console.log('DONE BANKING WORKER', worker.threadId, data)
        })

        worker.on('exit', async () => {
          resolve()
        })

      })

    });

    await Promise.all(promises)
  } catch (error) {
    console.log(error)
  }
  return true
}

// createBulkFakeTransaction(7).then((users) => {
//   console.log('Bulk banking transaction created:', users)
// }).catch((error) => {
//   console.error('Error creating bulk transaction created:', error)
//   return
// })
