'use strict'

import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { v4 as uuidv4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */

async function up (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    // Check if a Birthday Bonus already exists
    const existingBirthdayBonus = await queryInterface.rawSelect(
      'bonus',
      {
        where: {
          bonus_type: BONUS_TYPES.BIRTHDAY
        },
        attributes: ['id'], // Only check for the existence of the ID
        transaction
      },
      ['id'] // Limit the result to just the ID
    )

    // If a Birthday Bonus exists, skip the seeder
    if (existingBirthdayBonus) {
      console.log('Birthday Bonus already exists. Skipping seeder.')
      await transaction.rollback()
      return
    }

    // Seed Bonus data for the Birthday Bonus
    const [bonus] = await queryInterface.bulkInsert('bonus', [{
      code: uuidv4(),
      bonus_type: BONUS_TYPES.BIRTHDAY,
      valid_on_days: parseInt('1111111', 2), // All 7 days active
      image_url: 'https://example.com/birthday-bonus-image.jpg',
      term_and_condition: JSON.stringify({ terms: 'Standard terms and conditions apply.' }),
      promotion_title: JSON.stringify({ en: 'Happy Birthday Bonus', es: 'Bono de Cumpleaños' }),
      description: JSON.stringify({ en: 'Celebrate your birthday with a special bonus!', es: '¡Celebra tu cumpleaños con un bono especial!' }),
      tag_ids: null, // Example tag IDs
      is_active: false,
      wagering_template_id: null,
      created_at: new Date(),
      updated_at: new Date()
    }], { returning: true, transaction })

    // Ensure that the returned value contains the ID properly
    const bonusId = bonus.id

    // Seed BonusCurrency data for the Birthday Bonus
    await queryInterface.bulkInsert('bonus_currencies', [{
      bonus_id: bonusId, // Use the correct bonus ID
      currency_id: 2,
      joining_amount: 0, // Example amount for Birthday Bonus
      min_deposit_amount: 0,
      min_bet_amount: 0,
      max_bonus_claimed: 0,
      meta_data: JSON.stringify({ amount: 10 }),
      created_at: new Date(),
      updated_at: new Date()
    }], { transaction })

    await transaction.commit()
  } catch (error) {
    console.error(error)
    await transaction.rollback()
  }
}

async function down (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    // Rollback Birthday Bonus and BonusCurrency seeder
    await queryInterface.bulkDelete('bonus_currencies', {
      bonus_id: {
        [Sequelize.Op.in]: queryInterface.rawSelect(
          'bonus',
          {
            where: { bonus_type: BONUS_TYPES.BIRTHDAY },
            attributes: ['id']
          },
          ['id']
        )
      }
    }, { transaction })

    await queryInterface.bulkDelete('bonus', { bonus_type: BONUS_TYPES.BIRTHDAY }, { transaction })

    await transaction.commit()
  } catch (error) {
    console.error(error)
    await transaction.rollback()
  }
}

export { up, down }
