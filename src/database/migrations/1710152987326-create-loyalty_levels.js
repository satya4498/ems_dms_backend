module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'loyalty_levels',
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
        name: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          fieldName: 'level',
          _modelAttribute: true,
          field: 'level'
        },
        coefficient: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          fieldName: 'coefficient',
          _modelAttribute: true,
          field: 'coefficient'
        },
        levelUpPoints: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          fieldName: 'levelUpPoints',
          _modelAttribute: true,
          field: 'level_up_points'
        },
        levelHoldPoints: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          fieldName: 'levelHoldPoints',
          _modelAttribute: true,
          field: 'level_hold_points'
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
    return queryInterface.dropTable('loyalty_levels', { schema: 'public' })
  }
}
