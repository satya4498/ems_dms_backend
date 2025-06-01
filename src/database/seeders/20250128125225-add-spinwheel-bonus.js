'use strict';

import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */

async function up(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();
  console.log(BONUS_TYPES.FREESPINS, "==========================")
  
  try {
    // Check if the spinWheel bonus already exists
    const existingSpinWheelBonus = await queryInterface.rawSelect(
      'bonus',
      {
        where: {
          bonus_type: BONUS_TYPES.FREESPINS // Assuming SPIN_WHEEL is defined in BONUS_TYPES
        },
        attributes: ['id'], // Check only for the ID
        transaction
      },
      ['id'] // Limit the result to just the ID
    );

    if (existingSpinWheelBonus) {
      console.log('SpinWheel Bonus already exists. Skipping seeder.');
      await transaction.rollback();
      return;
    }
   
    // Insert spinWheel bonus into the bonus table
    const [bonus] = await queryInterface.bulkInsert('bonus', [{
      code: uuidv4(),
      bonus_type: BONUS_TYPES.FREESPINS,
      valid_on_days: parseInt('1111111', 2), // Active all 7 days
      image_url: 'https://example.com/spinwheel-image.jpg',
      term_and_condition: JSON.stringify({ terms: 'Spin the wheel to win exciting bonuses!' }),
      promotion_title: JSON.stringify({ en: 'SpinWheel Bonus', es: 'Bono SpinWheel' }),
      description: JSON.stringify({ en: 'Spin the wheel to win bonuses', es: 'Gira la rueda para ganar bonos' }),
      tag_ids: null, // Example tag IDs
      is_active: true,
      wagering_template_id: null,
      created_at: new Date(),
      updated_at: new Date()
    }], { returning: true, transaction });

    const spinWheelBonusId = bonus.id;

    // Insert spinWheel bonus currencies
    await queryInterface.bulkInsert('bonus_currencies', [{
      bonus_id: spinWheelBonusId,
      currency_id: 2,
      joining_amount: 0.0, // No fixed amount
      min_deposit_amount: 0.0, // No deposit required for spinning
      min_bet_amount: 0.0, // No minimum bet required
      max_bonus_claimed: 1000.0, // Maximum claimable amount after spins
      created_at: new Date(),
      updated_at: new Date()
    }], { transaction });

    await transaction.commit();
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    throw error;
  }
}

async function down(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    // Rollback SpinWheel bonus and related bonus currencies
    // await queryInterface.bulkDelete('bonus_currencies', { bonus_id: SPIN_WHEEL_BONUS_ID }, { transaction });
    // await queryInterface.bulkDelete('bonus', { bonus_type: BONUS_TYPES.SPIN_WHEEL }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export { up, down };
