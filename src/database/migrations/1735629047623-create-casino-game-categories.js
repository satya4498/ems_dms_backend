
module.exports = {
    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('casino_game_categories', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT,
          fieldName: 'id',
          field: 'id',
        },
        casinoGameId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'casino_games', 
            key: 'id',            
          },
          onDelete: 'CASCADE',    
          onUpdate: 'CASCADE',
          fieldName: 'casinoGameId',
          field: 'casino_game_id',
        },
        casinoCategoryId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'casino_categories', 
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          fieldName: 'casinoCategoryId',
          field: 'casino_category_id',
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          fieldName: 'createdAt',
          field: 'created_at',
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          fieldName: 'updatedAt',
          field: 'updated_at',
        },
      });
    },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
    down: async (queryInterface) => {
      await queryInterface.dropTable('casino_game_categories');
    },
  };
  