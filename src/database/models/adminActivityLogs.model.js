import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class adminActivityLogs extends ModelBase {
  static model = 'adminActivityLogs'

  static table = 'admin_activity_logs'

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fieldsAffected: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    recordId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'record_id'
    },
    adminId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'admin_id'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    }
  }

  static associate (models) {
    adminActivityLogs.belongsTo(models.adminUser, { foreignKey: 'adminId' })
    super.associate()
  }
}
