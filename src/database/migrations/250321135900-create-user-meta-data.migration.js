module.exports = {
    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
    up: async (queryInterface, DataTypes) => {
        return queryInterface.createTable(
            'user_meta_data', 
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
                    allowNull: false,
                    type: DataTypes.BIGINT,
                    fieldName: 'userId',
                    _modelAttribute: true,
                    field: 'user_id',
                    references: {
                        model: {
                            tableName: 'users',
                            schema: 'public'
                        },
                        key: 'id'
                    },
                    onDelete: 'cascade',
                    onUpdate: 'CASCADE'
                },
                last_password_changed_at: {
                    allowNull: true,
                    type: DataTypes.DATE,
                    fieldName: 'lastPasswordChangedAt',
                    _modelAttribute: true,
                    field: 'last_password_changed_at'
                },
                last_account_deactivated_at: {
                    allowNull: true,
                    type: DataTypes.DATE,
                    fieldName: 'lastAccountDeactivatedAt',
                    _modelAttribute: true,
                    field: 'last_account_deactivated_at'
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
        );
    },

    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').DataTypes} DataTypes
     */
    down: async (queryInterface, _) => {
        return queryInterface.dropTable('user_meta_data', { schema: 'public' });
    }
};
