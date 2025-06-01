
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'thread_messages',
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
        adminId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'adminId',
          _modelAttribute: true,
          field: 'admin_id',
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
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        threadId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'threadId',
          _modelAttribute: true,
          field: 'thread_id',
          references: {
            model: {
              tableName: 'main_threads',
              table: 'main_threads',
              name: 'mainThread',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
          fieldName: 'content',
          _modelAttribute: true,
          field: 'content'
        },
        adminRead: {
          defaultValue: false,
          type: DataTypes.BOOLEAN,
          fieldName: 'adminRead',
          _modelAttribute: true,
          field: 'admin_read'
        },
        userRead: {
          defaultValue: false,
          type: DataTypes.BOOLEAN,
          fieldName: 'userRead',
          _modelAttribute: true,
          field: 'user_read'
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
    return queryInterface.dropTable('thread_messages', { schema: 'public' })
  }
}
