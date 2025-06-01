
import _ from 'lodash';
import path from 'path';
const { sequelize } = require('../../src/database/models')
const { Worker } = require('worker_threads');

sequelize.options.logging = false



// const DEVICE_TYPES = {
//   MOBILE: 'Mobile',
//   DESKTOP: 'Desktop',
//   ALL_DEVICES: 'All device'
// }

// const DEVICE_TYPE_MAP = {
//   Mobile: [DEVICE_TYPES.MOBILE],
//   Desktop: [DEVICE_TYPES.DESKTOP],
//   'All device': [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.MOBILE]
// }

// const CATEGORIES = {
//   Live: 1,
//   Slot: 2,
//   Virtuals: 3,
//   TvGames: 4,
//   Poker: 5,
//   SportBook: 6
// }

// const AGGREGATORS = {
//   NUX: {
//     id: '1',
//     name: 'nux'
//   }
// }

/**
 * @type {Object.<string, { id: string, name: string, subCategories: { id: string, name: string }[] }[]>}
 */
export const DEFAULT_CATEGORIES = [{
  id: 1,
  name: 'Live'
}, {
  id: 2,
  name: 'Slot'
}, {
  id: 3,
  name: 'Virtuals'
}, {
  id: 4,
  name: 'TvGames'
}, {
  id: 5,
  name: 'Poker'
}, {
  id: 6,
  name: 'SportBook'
}]

// async function loadCasinoData() {
//   /** @type {Language[]} */
//   const transaction = await sequelize.transaction()
//   const languages = await sequelize.models.language.findAll({ attributes: ['id', 'code'], raw: true, transaction })

//   try {
//     const aggregator = await createAggregator(AGGREGATORS.NUX.id, AGGREGATORS.NUX.name, languages, transaction)

//     const providers = require('./casinoJsons/providers')
//     const providerIdsMap = await createProviders(aggregator.id, providers, languages, transaction)

//     const categoryIdsMap = await createCategories(DEFAULT_CATEGORIES, languages, transaction)

//     const games = require('./casinoJsons/games')
//     await createGames(categoryIdsMap, providerIdsMap, games, languages, transaction)
//     await transaction.commit()
//     return { success: true }
//   } catch (error) {
//     console.log(error, "<==========================>")
//     await transaction.rollback()
//     // throw new APIError(error)
//   }
// }

// /**
//  * @param {Language[]} languages
//  * @param {string} defaultName
//  */
// function getNames(languages, defaultName) {
//   return languages.reduce((prev, language) => {
//     prev[language.code] = defaultName
//     return prev
//   }, {})
// }

// /**
//  * @param {string} uniqueId
//  * @param {string} name
//  * @param {Language[]} languages
//  * @param {import ('sequelize').Transaction} transaction
//  * @returns {{ id: string }}
//  */
// async function createAggregator(uniqueId, name, languages, transaction) {
//   const aggregatorNames = getNames(languages, name)
//   const [aggregator] = await sequelize.models.casinoAggregator.findOrCreate({
//     defaults: { name: aggregatorNames, uniqueId },
//     where: { uniqueId },
//     returning: ['id'],
//     transaction,
//     logging: false
//   })

//   return aggregator
// }

// /**
//  * @param {string} aggregatorId
//  * @param {{ id: number, name: string, logo: string, category: number }[]} providers
//  * @param {Language[]} languages
//  * @param {import ('sequelize').Transaction} transaction
//  * @returns {Object.<string, string>}
//  */
// async function createProviders(aggregatorId, providers, languages, transaction) {
//   const updatedProviders = await sequelize.models.casinoProvider.bulkCreate(providers.map(provider => {
//     return {
//       casinoAggregatorId: aggregatorId,
//       uniqueId: provider.id,
//       name: getNames(languages, provider.name),
//       iconUrl: provider.logo
//     }
//   }), {
//     updateOnDuplicate: ['name', 'iconUrl'],
//     transaction,
//     logging: false
//   })

//   return updatedProviders.reduce((prev, updatedProvider) => {
//     prev[updatedProvider.uniqueId] = updatedProvider.id
//     return prev
//   }, {})
// }

// /**
//    * @param {typeof DEFAULT_CATEGORIES[string]} categories
//    * @param {Language[]} languages
//    * @param {import ('sequelize').Transaction} transaction
//    * @returns {Object.<string, string>}
//    */
// async function createCategories(categories, languages, transaction) {
//   const updatedCategories = await sequelize.models.casinoCategory.bulkCreate(categories.map(category => {
//     return {
//       uniqueId: category.id,
//       name: getNames(languages, category.name),
//     }
//   }), {
//     returning: ['id', 'uniqueId'],
//     updateOnDuplicate: ['updatedAt'],
//     transaction,
//     logging: true
//   })

//   return updatedCategories.reduce((prev, category) => {
//     prev[category.uniqueId] = category.id
//     return prev
//   }, {})
// }

// /**
//  * @param {Object.<string, string>} subCategoryIdsMap
//  * @param {Object.<string, string>} providerIdsMap
//  * @param {{ id: string, name: string, basicRTP: number, device: string, typeId: string, providerId: string, img_provider: string, img: string, demo: boolean }[]} games
//  * @param {Language[]} languages
//  * @param {import ('sequelize').Transaction} transaction
//  * @returns {Boolean}
//  */
// async function createGames(categoryIdsMap, providerIdsMap, games, languages, transaction) {
//   await sequelize.models.casinoGame.bulkCreate(games.reduce((prev, game) => {
//     const providerId = providerIdsMap[game.providerId]
//     if (!providerId) return prev
//     const categoryId = categoryIdsMap[game.typeId] ? categoryIdsMap[game.typeId] : categoryIdsMap[CATEGORIES.Live]
//     if (!categoryId) return prev

//     prev.push({
//       casinoProviderId: providerId,
//       casinoCategoryId: categoryId,
//       uniqueId: game.id,
//       name: getNames(languages, game.name),
//       returnToPlayer: game.basicRTP,
//       wageringContribution: 0,
//       iconUrl: game.img_vertical ? game.img_vertical : game.img,
//       devices: DEVICE_TYPE_MAP[game.device],
//       demoAvailable: game.demo
//     })
//     return prev
//   }, []), {
//     updateOnDuplicate: ['name', 'iconUrl'],
//     transaction,
//     logging: true
//   })

//   return true
// }

export async function createBulkCasinoTransaction(count, timePeriod) {
  const users = await sequelize.models.user.findAll({
    attributes: ['id']
  })

  let games = await sequelize.models.casinoGame.findAll({ attributes: ['id'], raw: true })
  if (!games.length) {
    console.log('Unable to fetch casino games!')
    return false;
  }

  games = games.map(game => game.id)

  try {
    const chunkedUsers = _.chunk(users, parseInt(users.length / 10))
    const promises = chunkedUsers.map(async users => {

      return new Promise(resolve => {

        const convertedUsers = users.map(user => {
          return user.dataValues
        })

        const worker = new Worker(path.resolve(__dirname, './casinoWorker.js'), { workerData: { convertedUsers, count, games, timePeriod } });

        worker.on('message', async (data) => {
          console.log('DONE CASINO WORKER', worker.threadId, data)
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


// createBulkCasinoTransaction(20).then((users) => {
//   console.log('Bulk casino transaction created:', users)
// }).catch((error) => {
//   console.error('Error creating bulk casino transaction:', error)
//   return
// })
