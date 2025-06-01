'use strict'

// Importing the state codes to names mapping
import stateCodeUsa from '../models/stateCodeUsa.json'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up(queryInterface, DataTypes) {
  // Mapping over stateCodesToStates to prepare data for insertion
  await queryInterface.bulkInsert('states', Object.keys(stateCodeUsa).map(stateCode => {
    return {
      code: stateCode,
      name: stateCodeUsa[stateCode],
      created_at: new Date(),
      updated_at: new Date()
    }
  }), {})
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down(queryInterface, DataTypes) {
  // Reverting the seeder by deleting rows from the states table
  await queryInterface.bulkDelete('states', null, {})
}

export { up, down }
