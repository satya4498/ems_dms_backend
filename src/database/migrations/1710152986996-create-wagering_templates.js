module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'wagering_templates',
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
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        wageringRequirementType: {
          type: DataTypes.ENUM(['bonus', 'bonus_plus_cash']),
          allowNull: false,
          fieldName: 'wageringRequirementType',
          _modelAttribute: true,
          field: 'wagering_requirement_type'
        },
        wageringMultiplier: {
          type: DataTypes.DOUBLE,
          defaultValue: 1.0,
          fieldName: 'wageringMultiplier',
          _modelAttribute: true,
          field: 'wagering_multiplier'
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
    return queryInterface.dropTable('wagering_templates', { schema: 'public' })
  }
}
