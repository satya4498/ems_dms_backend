'use strict'

import { PAYMENT_PROVIDER_CATEGORY, PAYMENT_PROVIDER, PAYMENT_AGGREGATOR } from '@src/utils/constants/payment.constants'

/** @type {import('sequelize-cli').Migration} */

async function up (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    const paymentProvider = await queryInterface.bulkInsert('payment_providers', [{
      name: JSON.stringify({
        EN: PAYMENT_PROVIDER.SKRILL
      }),
      aggregator: PAYMENT_AGGREGATOR.PAYSAFE,
      category: PAYMENT_PROVIDER_CATEGORY.INSTANT_BANKING,
      image: '',
      description: JSON.stringify({
        EN: PAYMENT_PROVIDER.SKRILL
      }),
      blocked_countries: JSON.stringify([]),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: JSON.stringify({
        EN: PAYMENT_PROVIDER.NETELLER
      }),
      aggregator: PAYMENT_AGGREGATOR.PAYSAFE,
      category: PAYMENT_PROVIDER_CATEGORY.INSTANT_BANKING,
      image: '',
      description: JSON.stringify({
        EN: PAYMENT_PROVIDER.NETELLER
      }),
      blocked_countries: JSON.stringify([]),
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: JSON.stringify({
        EN: PAYMENT_PROVIDER.COINPAYMENT
      }),
      aggregator: PAYMENT_AGGREGATOR.COINPAYMENT,
      category: PAYMENT_PROVIDER_CATEGORY.CRYPTO,
      image: '',
      description: JSON.stringify({
        EN: PAYMENT_PROVIDER.COINPAYMENT
      }),
      blocked_countries: JSON.stringify([]),
      created_at: new Date(),
      updated_at: new Date()
    }], { returning: true, transaction })
    const [[currency]] = await queryInterface.sequelize.query('select * from currencies where is_default= true')
    const providerLimit = paymentProvider.map(limit => {
      return {
        provider_id: limit.id,
        currency_id: currency.id,
        min_deposit: 100,
        max_deposit: 1000,
        min_withdraw: 100,
        max_withdraw: 1000,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    await queryInterface.bulkInsert('provider_limits', providerLimit, { transaction })
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
  }
}

async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('payment_providers')
  await queryInterface.bulkDelete('provider_limits')
}

export { down, up }
