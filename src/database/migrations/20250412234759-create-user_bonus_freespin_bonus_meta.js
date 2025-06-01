module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'user_bonus_freespin_bonus_meta',
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
        userBonusId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'userBonusId',
          _modelAttribute: true,
          field: 'user_bonus_id',
          references: {
            model: {
              tableName: 'user_bonus',
              table: 'user_bonus',
              name: 'userBonus',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        remainingFreespins: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'remainingFreespins',
          _modelAttribute: true,
          field: 'remaining_freespins'
        },
        betLevel: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'betLevel',
          _modelAttribute: true,
          field: 'bet_level'
        },
        allowedGames: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'allowedGames',
          _modelAttribute: true,
          field: 'allowed_games'
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
    return queryInterface.dropTable('user_bonus_freespin_bonus_meta', {
      schema: 'public'
    })
  }
}
