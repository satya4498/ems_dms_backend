module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Remove existing unique constraint on phone if it exists
    await queryInterface.sequelize.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_phone_key;
    `)

    // Make phone field nullable
    await queryInterface.sequelize.query(`
      ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
    `)

    // Add back unique constraint (allows multiple NULLs)
    await queryInterface.sequelize.query(`
      ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);
    `)

    // Make email unique (if not already)
    await queryInterface.sequelize.query(`
      ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
    `)
  },

  down: async (queryInterface, DataTypes) => {
    // Remove constraints
    await queryInterface.sequelize.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_phone_unique;
    `)

    await queryInterface.sequelize.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_unique;
    `)

    // Revert phone to NOT NULL (this might fail if there are NULL values)
    await queryInterface.sequelize.query(`
      ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
    `)

    // Add back original constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE users ADD CONSTRAINT users_phone_key UNIQUE (phone);
    `)
  }
}
