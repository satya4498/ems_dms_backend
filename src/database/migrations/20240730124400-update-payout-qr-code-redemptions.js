'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add status column
    await queryInterface.addColumn('payout_qr_code_redemptions', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    })

    // Add admin_id column
    await queryInterface.addColumn('payout_qr_code_redemptions', 'admin_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Admin who approved/rejected the request'
    })

    // Add approved_at column
    await queryInterface.addColumn('payout_qr_code_redemptions', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true
    })

    // Add remarks column
    await queryInterface.addColumn('payout_qr_code_redemptions', 'remarks', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Admin remarks for approval/rejection'
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns in reverse order
    await queryInterface.removeColumn('payout_qr_code_redemptions', 'remarks')
    await queryInterface.removeColumn('payout_qr_code_redemptions', 'approved_at')
    await queryInterface.removeColumn('payout_qr_code_redemptions', 'admin_id')
    await queryInterface.removeColumn('payout_qr_code_redemptions', 'status')

    // Drop the enum type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payout_qr_code_redemptions_status";')
  }
}
