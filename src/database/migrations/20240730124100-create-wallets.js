module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('wallets', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
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
      currency_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'currencies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
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
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('wallets')
  }
}
