module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'banners',
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        bannerTypeId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'type',
          _modelAttribute: true,
          field: 'type',
          references: {
            model: {
              tableName: 'banner_types',
              table: 'banner_types',
              name: 'banner_type',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          }
        },
        description: {
          type: DataTypes.JSONB,
          defaultValue: { },
          allowNull: false,
          fieldName: 'description',
          _modelAttribute: true,
          field: 'description'
        },
        mobileImageUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'mobileImageUrl',
          _modelAttribute: true,
          field: 'mobile_image_url'
        },
        desktopImageUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'desktopImageUrl',
          _modelAttribute: true,
          field: 'desktop_image_url'
        },
        orderId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'orderId',
          _modelAttribute: true,
          field: 'order_id'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
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
    return queryInterface.dropTable('banners', { schema: 'public' })
  }
}
