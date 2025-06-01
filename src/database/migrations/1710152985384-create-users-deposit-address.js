module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'users_deposit_addresses',
      {
        id: {
          allowNull: false,
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        currencyId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'currencyId',
          _modelAttribute: true,
          field: 'currency_id',
          references: {
            model: {
              tableName: 'currencies',
              table: 'currencies',
              name: 'currency',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'userId',
          _modelAttribute: true,
          field: 'user_id',
          references: {
            model: {
              tableName: 'users',
              table: 'users',
              name: 'user',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        networkAddress: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'networkAddress',
          _modelAttribute: true,
          field: 'network_address'
        },
        addressId: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'addressId',
          _modelAttribute: true,
          field: 'address_id'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'createdAt',
          _modelAttribute: true,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'updatedAt',
          _modelAttribute: true,
          field: 'updated_at'
        }
      },
      {
        schema: 'public'
      }
    )
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return queryInterface.dropTable('users_deposit_addresses', { schema: 'public' })
  }
}
