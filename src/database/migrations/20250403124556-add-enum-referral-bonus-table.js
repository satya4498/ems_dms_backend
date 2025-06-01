module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_bonus_bonus_type" ADD VALUE \'referral\';',
        { transaction }
      )
    })
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, DataTypes) => {
    // Note: Removing a value from an ENUM type is not supported by PostgreSQL.
    // You would need to recreate the ENUM type without the value.
    // This is a placeholder for the down migration.
    console.log('Down migration not supported for ENUM type value removal.')
  }
}
