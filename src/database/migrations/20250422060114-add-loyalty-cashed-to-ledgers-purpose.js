/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query(`
    ALTER TYPE "enum_ledgers_purpose" ADD VALUE IF NOT EXISTS 'LoyaltyCashed'`);
  },

  down: async (queryInterface, DataTypes) => {
    console.warn("Rollback not possible for ENUM modifications. Consider recreating the ENUM type if needed.");
  }
};
