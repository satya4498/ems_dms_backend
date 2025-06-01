module.exports = {
    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
    up: async (queryInterface, DataTypes) => {
      return queryInterface.addColumn(
        'casino_providers',
        'restricted_states',
        {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          fieldName: 'restrictedStates',
          _modelAttribute: true,
          field: 'restricted_states'
        }
      );
    },
    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
    down: async (queryInterface, _) => {
      return queryInterface.removeColumn(
        'casino_providers', // Name of the existing table
        'restricted_states' // Column to remove
      );
    }
  };
  