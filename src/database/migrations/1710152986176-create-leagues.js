module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'leagues',
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        providerId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'providerId',
          _modelAttribute: true,
          field: 'provider_id'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        sportId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'sportId',
          _modelAttribute: true,
          field: 'sport_id',
          references: {
            model: {
              tableName: 'sports',
              table: 'sports',
              name: 'sport',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        locationId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'locationId',
          _modelAttribute: true,
          field: 'location_id',
          references: {
            model: {
              tableName: 'locations',
              table: 'locations',
              name: 'location',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'createdAt',
          _modelAttribute: true,
          field: 'created_at'
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
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
    return queryInterface.dropTable('leagues', { schema: 'public' })
  }
}
