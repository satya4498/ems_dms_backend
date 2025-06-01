module.exports = {
    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
    up: async (queryInterface, DataTypes) => {
      return queryInterface.createTable(
        'kyc_details',
        {
          id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            fieldName: 'id',
            _modelAttribute: true,
            field: 'id'
          },
          name: {
            type: DataTypes.STRING,
            fieldName: 'name',
            _modelAttribute: true,
            field: 'name'
          },
          isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            fieldName: 'isActive',
            _modelAttribute: true,
            field: 'is_active',
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
      return queryInterface.dropTable('kyc_details', { schema: 'public' })
    }
  }