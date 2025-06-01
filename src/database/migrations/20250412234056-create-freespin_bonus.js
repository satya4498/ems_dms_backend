module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'freespin_bonus',
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
        freespinQuantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'freespinQuantity',
          _modelAttribute: true,
          field: 'freespin_quantity'
        },
        gameIds: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'gameIds',
          _modelAttribute: true,
          field: 'game_ids'
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
    return queryInterface.dropTable('freespin_bonus', { schema: 'public' })
  }
}
