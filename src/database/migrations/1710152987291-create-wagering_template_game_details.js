module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'wagering_template_game_details',
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
        casinoGameId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'casinoGameId',
          _modelAttribute: true,
          field: 'casino_game_id',
          references: {
            model: {
              tableName: 'casino_games',
              table: 'casino_games',
              name: 'casinoGame',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        wageringTemplateId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'wageringTemplateId',
          _modelAttribute: true,
          field: 'wagering_template_id',
          references: {
            model: {
              tableName: 'wagering_templates',
              table: 'wagering_templates',
              name: 'wageringTemplate',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        contributionPercentage: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 100,
          fieldName: 'contributionPercentage',
          _modelAttribute: true,
          field: 'contribution_percentage'
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
    return queryInterface.dropTable('wagering_template_game_details', {
      schema: 'public'
    })
  }
}
