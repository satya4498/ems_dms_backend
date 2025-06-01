module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'thread_attachements',
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
        messageId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'messageId',
          _modelAttribute: true,
          field: 'message_id',
          references: {
            model: {
              tableName: 'thread_messages',
              table: 'thread_messages',
              name: 'threadMessage',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        filePath: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'filePath',
          _modelAttribute: true,
          field: 'file_path'
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
    return queryInterface.dropTable('thread_attachements', { schema: 'public' })
  }
}
