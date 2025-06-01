'use strict'

import { v4 as UUID } from 'uuid'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  // Fetch coin for GC and SC
  const currencyId = await queryInterface.rawSelect(
    'currencies',
    { where: { code: 'BSC' } },
    ['id']
  )

  if (!currencyId) throw new Error("Currency ID for 'GC' or 'SC' not found.")

  // Get existing bonuses
  const existingBonuses = await queryInterface.sequelize.query(
    'SELECT bonus_type FROM bonus WHERE bonus_type IN (\'daily-spin-wheel\', \'weekly-spin-wheel\', \'monthly-spin-wheel\');',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  )

  const existingBonusTypes = existingBonuses.map(bonus => bonus.bonus_type)

  // Define new bonuses
  const bonuses = [
    {
      term_and_condition: JSON.stringify({ EN: 'Daily Spin Wheel' }),
      promotion_title: JSON.stringify({ EN: 'Daily' }),
      bonus_type: 'daily-spin-wheel',
      image_url: 'https://gammastack-casino.s3.us-east-1.amazonaws.com/assets/bonus/30.png',
      description: JSON.stringify({ EN: 'Daily Spin Wheel Bonus' }),
      wagering_template_id: null,
      visible_in_promotions: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      code: UUID()
    },
    {
      term_and_condition: JSON.stringify({ EN: 'Weekly Spin Wheel' }),
      promotion_title: JSON.stringify({ EN: 'Weekly' }),
      bonus_type: 'weekly-spin-wheel',
      image_url: 'https://gammastack-casino.s3.us-east-1.amazonaws.com/assets/bonus/30.png',
      description: JSON.stringify({ EN: 'Weekly Spin Wheel Bonus' }),
      wagering_template_id: null,
      visible_in_promotions: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      code: UUID()
    },
    {
      term_and_condition: JSON.stringify({ EN: 'Monthly Spin Wheel' }),
      promotion_title: JSON.stringify({ EN: 'Monthly' }),
      bonus_type: 'monthly-spin-wheel',
      image_url: 'https://gammastack-casino.s3.us-east-1.amazonaws.com/assets/bonus/30.png',
      description: JSON.stringify({ EN: 'Monthly Spin Wheel Bonus' }),
      wagering_template_id: null,
      visible_in_promotions: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      code: UUID()
    }
  ]

  // Filter out bonuses that already exist
  const newBonuses = bonuses.filter(bonus => !existingBonusTypes.includes(bonus.bonus_type))

  if (newBonuses.length > 0) {
    await queryInterface.bulkInsert('bonus', newBonuses)

    // Fetch inserted bonuses
    const insertedBonuses = await queryInterface.sequelize.query(
      `SELECT id, bonus_type FROM bonus WHERE bonus_type IN (${newBonuses.map(b => `'${b.bonus_type}'`).join(', ')});`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // Prepare bonus-currency mapping
    const bonusCurrencies = insertedBonuses.map(bonus => ({
      bonus_id: bonus.id,
      currency_id: currencyId,
      created_at: new Date(),
      updated_at: new Date()
    }))

    // Insert into bonus_currencies table
    if (bonusCurrencies.length > 0) {
      await queryInterface.bulkInsert('bonus_currencies', bonusCurrencies)
    }
  } else {
    console.log('No new bonuses to insert.')
  }
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  await queryInterface.bulkDelete('bonus', {
    bonus_type: ['daily-spin-wheel', 'weekly-spin-wheel', 'monthly-spin-wheel']
  })
}

export { up, down }
