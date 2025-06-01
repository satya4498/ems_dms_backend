module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    // Step 1: Add new values to the existing ENUM type
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_user_limits_key"
      ADD VALUE IF NOT EXISTS 'daily_play_limit';
      ALTER TYPE "enum_user_limits_key"
      ADD VALUE IF NOT EXISTS 'weekly_play_limit';
      ALTER TYPE "enum_user_limits_key"
      ADD VALUE IF NOT EXISTS 'monthly_play_limit';
      ALTER TYPE "enum_user_limits_key"
      ADD VALUE IF NOT EXISTS 'daily_purchase_limit';
      ALTER TYPE "enum_user_limits_key"
      ADD VALUE IF NOT EXISTS 'weekly_purchase_limit';
      ALTER TYPE "enum_user_limits_key"
      ADD VALUE IF NOT EXISTS 'monthly_purchase_limit';
    `);

    // Step 2: Update existing rows in the 'user_limits' table
    await queryInterface.sequelize.query(`
      UPDATE "public"."user_limits"
      SET "key" = 'daily_play_limit'
      WHERE "key" = 'daily_bet_limit';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "public"."user_limits"
      SET "key" = 'weekly_play_limit'
      WHERE "key" = 'weekly_bet_limit';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "public"."user_limits"
      SET "key" = 'monthly_play_limit'
      WHERE "key" = 'monthly_bet_limit';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "public"."user_limits"
      SET "key" = 'daily_purchase_limit'
      WHERE "key" = 'daily_deposit_limit';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "public"."user_limits"
      SET "key" = 'weekly_purchase_limit'
      WHERE "key" = 'weekly_deposit_limit';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "public"."user_limits"
      SET "key" = 'monthly_purchase_limit'
      WHERE "key" = 'monthly_deposit_limit';
    `);
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, DataTypes) => {
    // Rollback is tricky because we can't remove values from ENUM types directly.
    // You'll need to recreate the enum type if you want to remove values.
  }
}
