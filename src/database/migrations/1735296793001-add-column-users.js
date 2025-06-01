module.exports = {
    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
    up: async (queryInterface, DataTypes) => {
      return queryInterface.addColumn(
        'users',
        'state_id',
        {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: 'states',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      );
    },
  
    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
    down: async (queryInterface, _) => {
      return queryInterface.removeColumn(
        'users',
        'state_id'
      );
    }
  };
  