module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('payout_qr_code_redemptions', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      qr_code_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'payout_qr_codes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      redeemed_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    await queryInterface.addConstraint('payout_qr_code_redemptions', {
      fields: ['qr_code_id', 'user_id'],
      type: 'unique',
      name: 'unique_qr_code_id_user_id'
    })
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('payout_qr_code_redemptions')
  }
}
