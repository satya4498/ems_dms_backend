module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'purchase_bonus',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        bonusId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'bonusId',
          _modelAttribute: true,
          field: 'bonus_id',
          unique: true,
          references: {
            model: {
              tableName: 'bonus',
              table: 'bonus',
              name: 'bonus',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        percentage: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          fieldName: 'percentage',
          _modelAttribute: true,
          field: 'percentage'
        },
        packageIds: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: true,
          fieldName: 'packageIds',
          _modelAttribute: true,
          field: 'package_ids'
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
    return queryInterface.dropTable('deposit_bonus', { schema: 'public' })
  }
}
