import { DataTypes } from 'sequelize';
import ModelBase from './modelBase.model'

export default class LoyaltyLevelUser extends ModelBase {
  static model = 'loyaltyLevelUser';

  static table = 'loyalty_level_user';

  static options = {
    name: {
      singular: 'loyalty_level_user',
      plural: 'loyalty_level_users'
    }
  };


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
    loyaltyLevelId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true
    },
    cashAmount: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        'pending', 'active', 'cancelled', 'forfitted', 'expired', 'claimed', 'claiming', 'in_process', 'lapsed', 'zeroed_out'
      ),
      allowNull: false,
      defaultValue: 'pending'
    },
    claimedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  };

  static associate(models) {
    LoyaltyLevelUser.belongsTo(models.user, { foreignKey: 'userId' });
    LoyaltyLevelUser.belongsTo(models.loyaltyLevel, { foreignKey: 'loyaltyLevelId' });
    LoyaltyLevelUser.belongsTo(models.transaction, { foreignKey: 'transactionId' });
    LoyaltyLevelUser.belongsTo(models.currency, { foreignKey: 'currencyId' });
    super.associate();
  }
}
