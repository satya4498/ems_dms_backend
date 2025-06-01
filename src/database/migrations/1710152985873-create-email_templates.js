module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'email_templates',
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
        label: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'label',
          _modelAttribute: true,
          field: 'label'
        },
        eventType: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: [
            'welcome',
            'active_user',
            'inactive_user',
            'forgot_password',
            'reset_password',
            'email_verification',
            'document_rejected',
            'document_reminder',
            'document_received',
            'document_verified',
            'document_requested',
            'kyc_activated',
            'kyc_deactivated',
            'withdraw_processed',
            'withdraw_request_received',
            'withdraw_request_approved',
            'deposit_failed',
            'deposit_success',
            'gambling_registration',
            'joining_bonus',
            'password_updated'
          ],
          fieldName: 'eventType',
          _modelAttribute: true,
          field: 'event_type'
        },
        dynamicData: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'dynamicData',
          _modelAttribute: true,
          field: 'dynamic_data'
        },
        templateCode: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'templateCode',
          _modelAttribute: true,
          field: 'template_code'
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'isDefault',
          _modelAttribute: true,
          field: 'is_default'
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
    return queryInterface.dropTable('email_templates', { schema: 'public' })
  }
}
