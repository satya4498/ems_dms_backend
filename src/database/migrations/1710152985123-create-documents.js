module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'documents',
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
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'userId',
          _modelAttribute: true,
          field: 'user_id',
          references: {
            model: {
              tableName: 'users',
              table: 'users',
              name: 'user',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        actioneeId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'actioneeId',
          _modelAttribute: true,
          field: 'actionee_id',
          references: {
            model: {
              tableName: 'admin_users',
              table: 'admin_users',
              name: 'adminUser',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        documentLabelId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'documentLabelId',
          _modelAttribute: true,
          field: 'document_label_id',
          references: {
            model: {
              tableName: 'document_labels',
              table: 'document_labels',
              name: 'documentLabel',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        url: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'url',
          _modelAttribute: true,
          field: 'url'
        },
        status: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: 'pending',
          values: ['pending', 'approved', 'rejected', 'requested'],
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'comment',
          _modelAttribute: true,
          field: 'comment'
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
    return queryInterface.dropTable('documents', { schema: 'public' })
  }
}
