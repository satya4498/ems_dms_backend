'use strict'
import { KYC_METHODS } from '@src/utils/constants/app.constant'


/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('kyc_details',
    [{
      is_active: true,
      name: KYC_METHODS.MANUAL,
      created_at: new Date(),
      updated_at: new Date()
    },{
      is_active: false,
      name: KYC_METHODS.SHUFTI,
      created_at: new Date(),
      updated_at: new Date()
    }
  ])

  await queryInterface.bulkUpdate(
    'users',
    {
      kyc_method: KYC_METHODS.MANUAL
    },
    { kyc_status: true }
  );
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('kyc_details')
}
export { down, up }
