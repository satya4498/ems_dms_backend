module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      walletId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'wallets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'wallet_id'
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('credit', 'debit'),
        allowNull: false
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    })
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('transactions')
  }
}
