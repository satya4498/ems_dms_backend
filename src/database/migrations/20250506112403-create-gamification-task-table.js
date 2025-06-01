'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'gamification_tasks',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          field: 'id'
        },
        gamificationId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'gamification_id',
          references: {
            model: {
              tableName: 'gamification',
              schema: 'public'
            },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        name: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'name'
        },
        description: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'description'
        },
        conditions: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'conditions',
          comment: 'Stores dynamic fields like betCountNeeded, depositAmount etc.'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: 'is_active'
        },
        batchTitle: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'batch_title'
        },
        validFrom: {
          allowNull: true,
          type: DataTypes.DATE,
          defaultValue: null,
          field: 'valid_from'
        },
        validTo: {
          allowNull: true,
          type: DataTypes.DATE,
          defaultValue: null,
          field: 'valid_to'
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'image_url'
        },
        claimCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'claim_count'
        },
        metaData: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'meta_data',
          defaultValue: {}
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
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
   */
  down: async (queryInterface) => {
    return queryInterface.dropTable('gamification_tasks', { schema: 'public' })
  }
}
