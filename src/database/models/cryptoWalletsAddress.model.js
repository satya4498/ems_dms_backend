import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class CryptoWalletAddress extends ModelBase {
  static model = 'cryptoWalletAddress'

  static table = 'crypto_wallet_addresses'

  static options = {
    name: {
      singular: 'crypto_wallet_address',
      plural: 'crypto_wallet_addresses'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    walletId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cryptocurrencyId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    CryptoWalletAddress.belongsTo(models.currency, { foreignKey: 'currencyId' })
    super.associate()
  }
}
