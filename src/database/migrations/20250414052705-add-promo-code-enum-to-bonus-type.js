'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TYPE "enum_bonus_bonus_type" ADD VALUE \'promo_code\';')
  },

  down: async (queryInterface) => {
    // PostgreSQL does not support removing ENUM values directly.
    // A workaround would be to recreate the ENUM type without the 'promo_code' value,
    // but it can be complex if the column is in use.
  }
}
