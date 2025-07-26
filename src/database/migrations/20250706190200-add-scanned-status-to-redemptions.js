'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'scanned' to the existing enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_payout_qr_code_redemptions_status" ADD VALUE 'scanned';
    `)
  },

  down: async (queryInterface, Sequelize) => {
    // Note: PostgreSQL doesn't support removing enum values directly
    // This would require recreating the enum type, which is complex
    // For now, we'll leave the enum value in place
    console.log('Warning: Cannot remove enum value "scanned" from enum_payout_qr_code_redemptions_status')
  }
}
