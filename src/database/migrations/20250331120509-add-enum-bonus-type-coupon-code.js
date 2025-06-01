'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bonus_bonus_type" ADD VALUE IF NOT EXISTS 'rakeback'
    `)
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bonus_bonus_type" ADD VALUE IF NOT EXISTS 'coupon_code'
    `)
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bonus_bonus_type" ADD VALUE IF NOT EXISTS 'loosing'
    `)
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bonus_bonus_type" ADD VALUE IF NOT EXISTS 'purchase'
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // cant rollback this
  }
}
