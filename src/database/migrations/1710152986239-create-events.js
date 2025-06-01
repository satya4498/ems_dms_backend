module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'events',
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
        fixtureId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'fixtureId',
          _modelAttribute: true,
          field: 'fixture_id'
        },
        status: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: '0',
          values: ['0', '1', '2', '3', '4', '5', '6', '7'],
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
        },
        bettingEnabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          fieldName: 'bettingEnabled',
          _modelAttribute: true,
          field: 'betting_enabled'
        },
        score: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'score',
          _modelAttribute: true,
          field: 'score'
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'startDate',
          _modelAttribute: true,
          field: 'start_date'
        },
        leagueId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'leagueId',
          _modelAttribute: true,
          field: 'league_id',
          references: {
            model: {
              tableName: 'leagues',
              table: 'leagues',
              name: 'league',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
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
    return queryInterface.dropTable('events', { schema: 'public' })
  }
}
