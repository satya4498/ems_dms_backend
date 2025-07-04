module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('ledgers', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      transactionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'transactions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'transaction_id'
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
      balanceBefore: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'balance_before'
      },
      balanceAfter: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'balance_after'
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
    await queryInterface.dropTable('ledgers')
  }
}
