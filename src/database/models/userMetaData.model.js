import ModelBase from './modelBase.model'
import { DataTypes } from 'sequelize'

export default class UserMetaData extends ModelBase {
    static model = 'userMetaData'
    static table = 'user_meta_data'

    static options = {
        singular: 'userMetaData',
        plural: 'userMetaData'
    }

    static indexes = [{
        unique: true,
        fields: ['user_id', 'key']
    }]

    static attributes = {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        lastPasswordChangedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastAccountDeactivatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }

    static associate (models) {
        UserMetaData.belongsTo(models.user, { foreignKey: 'userId' })
        super.associate()
      }
}