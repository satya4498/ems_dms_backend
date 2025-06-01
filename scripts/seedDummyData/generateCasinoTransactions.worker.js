const { parentPort, workerData, threadId } = require('worker_threads');
const { sequelize } = require('../../src/database/models');
const { Faker, es } = require('@faker-js/faker');
const { APIError } = require('@src/errors/api.error');
const { NumberPrecision } = require('@src/libs/numberPrecision');
import { LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/public.constants.utils';
const { CASINO_TRANSACTION_STATUS } = require('@src/utils/constants/casinoManagement.constants');
const { CURRENCY_TYPES, LEDGER_PURPOSE, LEDGER_RULES, LEDGER_TYPES, SWEEPS_COINS } = require('@src/utils/constants/public.constants.utils');

const customFaker = new Faker({ locale: [es] });
sequelize.options.logging = false;

async function createLedger(args) {
  const { purpose, amount, walletId, transaction, transactionId, date } = args;
  const type = LEDGER_RULES[purpose];
  const WalletModel = sequelize.models.wallet;
  const LedgerModel = sequelize.models.ledger;

  try {
    const wallet = await WalletModel.findOne({ where: { id: walletId }, transaction, lock: true });

    if (!wallet) {
      throw new APIError('WalletNotFoundError');
    }

    const updatedAmount = type === LEDGER_TYPES.CREDIT
      ? NumberPrecision.plus(wallet.amount, amount)
      : NumberPrecision.minus(wallet.amount, amount);

    if (type === LEDGER_TYPES.DEBIT && updatedAmount < 0) {
      throw new APIError('InsufficientFundsError');
    }

    const ledgerData = {
      purpose,
      amount,
      currencyId: wallet.currencyId,
      transactionType: LEDGER_TRANSACTION_TYPE.CASINO,
      transactionId,
      [type === LEDGER_TYPES.CREDIT ? 'toWalletId' : 'fromWalletId']: wallet.id,
      createdAt: date,
      updatedAt: date
    };

    await LedgerModel.create(ledgerData, { transaction });
    wallet.amount = updatedAmount;
    await wallet.save({ transaction });

    return ledgerData;
  } catch (error) {
    console.error('Error in createLedger:', error);
    throw new APIError(error.message || 'LedgerCreationError');
  }
}

async function createCasinoTxn(userId, gameId, currencyType, amount, transactionId, roundId, metaData, purpose, date, transaction) {
  try {
    const casinoTransactionModel = sequelize.models.casinoTransaction;

    const wallets = await sequelize.models.wallet.findAll({
      where: { userId },
      include: {
        model: sequelize.models.currency,
        attributes: ['code', 'type'],
        where: { type: currencyType },
        required: true,
      },
      transaction,
    });

    if (!wallets.length) {
      throw new APIError('WalletsNotFoundError');
    }

    const totalBalance = wallets.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0);

    if (totalBalance < amount && purpose === LEDGER_PURPOSE.CASINO_BET) {
      throw new APIError('NotEnoughAmountError');
    }

    const casinoTransaction = await casinoTransactionModel.create({
      userId, gameId, transactionId, roundId, metaData, status: CASINO_TRANSACTION_STATUS.COMPLETED,
      createdAt: date,
      updatedAt: date
    }, { transaction });

    const isGameCoin = currencyType === CURRENCY_TYPES.GOLD_COIN;

    if (isGameCoin) {
      await createLedger({ amount, walletId: wallets[0].id, purpose, transactionId: casinoTransaction.id, transaction, date });
    } else {
      let remainingAmount = amount;
      if (purpose === LEDGER_PURPOSE.CASINO_BET) {
        const walletOrder = [SWEEPS_COINS.BSC, SWEEPS_COINS.PSC, SWEEPS_COINS.RSC];

        for (const currencyCode of walletOrder) {
          const wallet = wallets.find(w => w.currency.code === currencyCode);
          if (wallet && remainingAmount > 0) {
            const deductionAmount = Math.min(remainingAmount, wallet.amount);
            if (deductionAmount > 0) {
              await createLedger({ amount: deductionAmount, walletId: wallet.id, purpose, transactionId: casinoTransaction.id, transaction, date });
              remainingAmount = NumberPrecision.minus(remainingAmount, deductionAmount);
            }
            if (remainingAmount <= 0) break;
          }
        }
      }
      else if (remainingAmount > 0 && purpose === LEDGER_PURPOSE.CASINO_WIN) {
        remainingAmount = NumberPrecision.round(customFaker.number.float({ min: 2, max: 7 }));
        const wscWallet = wallets.find(w => w.currency.code === SWEEPS_COINS.RSC);
        if (wscWallet) {
          await createLedger({ amount: remainingAmount, walletId: wscWallet.id, purpose, transactionId: casinoTransaction.id, transaction, date });
        }
      }
    }

    return { casinoTransaction };
  } catch (error) {
    console.error('Error in createCasinoTxn:', error);
    throw new APIError(error.message || 'InternalServerError');
  }
}

async function generateCasinoTransactionData(count, games, timeWindow, userId, transaction) {
  const data = [];
  for (let index = 0; index < count; index++) {
    try {
      const gameId = customFaker.helpers.arrayElement(games);
      const winPurpose = LEDGER_PURPOSE.CASINO_WIN;
      const betPurpose = LEDGER_PURPOSE.CASINO_BET;
      const amount = NumberPrecision.round(customFaker.number.float({ min: 5, max: 10 }));
      const date = customFaker.date.between({ from: timeWindow.fromDate, to: timeWindow.toDate })
      const betResult = await createCasinoTxn(userId, gameId, CURRENCY_TYPES.SWEEP_COIN, amount, `txn_${customFaker.string.uuid()}`, `rnd_${customFaker.string.uuid()}`, {}, betPurpose, date, transaction);
      const winResult = await createCasinoTxn(userId, gameId, CURRENCY_TYPES.SWEEP_COIN, amount, `txn_${customFaker.string.uuid()}`, `rnd_${customFaker.string.uuid()}`, {}, winPurpose, date, transaction);

      data.push(betResult.casinoTransaction, winResult.casinoTransaction);
    } catch (error) {
      console.error('Error generating casino transaction data:', error);
    }
  }

  return data;
}

async function runner() {
  const transaction = await sequelize.transaction();
  try {
    await Promise.all(
      workerData.convertedUsers.map(user => generateCasinoTransactionData(workerData.count, workerData.games, workerData.timePeriod, user.id, transaction))
    );

    await transaction.commit();
    parentPort.postMessage(`Casino worker finished: ${threadId}`);
  } catch (error) {
    console.error('Transaction failed, rolling back:', error);
    await transaction.rollback();
    parentPort.postMessage(`Casino worker failed: ${threadId}`);
  }
}

console.log('STARTED CASINO WORKER', threadId);
runner();
