import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import stateCodeUsa from './stateCodeUsa.json'

export default class State extends ModelBase {
  static model = 'state'

  static table = 'states'

  static options = {
    name: {
      singular: 'state',
      plural: 'states'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.ENUM(Object.keys(stateCodeUsa)),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    languageId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }

  static associate (models) {
    State.belongsTo(models.language, { foreignKey: 'languageId' })
    State.hasMany(models.user, { foreignKey: 'stateId', onDelete: 'cascade' })
    super.associate()
  }
}
