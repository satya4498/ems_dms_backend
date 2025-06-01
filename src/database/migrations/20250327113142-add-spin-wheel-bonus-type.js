module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query(`
     ALTER TYPE "enum_bonus_bonus_type" ADD VALUE 'daily-spin-wheel';
     ALTER TYPE "enum_bonus_bonus_type" ADD VALUE 'weekly-spin-wheel';
     ALTER TYPE "enum_bonus_bonus_type" ADD VALUE 'monthly-spin-wheel';

    `)
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, DataTypes) => {
    // Note: PostgreSQL does not support removing values from an ENUM type directly.
    // The workaround is to create a new ENUM type without the removed values,
    // update the column type, and drop the old ENUM type.
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_bonus_bonus_type_new" AS ENUM ('freespins', 'deposit', 'joining');
      ALTER TABLE "bonus" ALTER COLUMN "bonus_type" TYPE "enum_bonus_bonus_type_new" USING "bonus_type"::text::"enum_bonus_bonus_type_new";
      DROP TYPE "enum_bonus_bonus_type";
      ALTER TYPE "enum_bonus_bonus_type_new" RENAME TO "enum_bonus_bonus_type";
    `)
  }
}
