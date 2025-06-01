const { parentPort, workerData, threadId } = require('worker_threads')
const { sequelize } = require('../../src/database/models')
import { Faker, es } from '@faker-js/faker'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/public.constants.utils'
import { LEDGER_PURPOSE, LEDGER_RULES, LEDGER_TYPES, SWEEPS_COINS, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'

const customFaker = new Faker({ locale: [es] })
sequelize.options.logging = false

async function createTxn(userId, code, amount, purpose, txn, transaction) {
  try {
    // Fetch wallet with locking for concurrency control
    const wallet = await sequelize.models.wallet.findOne({
      where: { userId },
      include: {
        attributes: ['code', 'type'],
        model: sequelize.models.currency,
        where: { code },
        required: true,
      },
      lock: transaction.LOCK.UPDATE,
      transaction,
    })

    if (!wallet) throw new Error('WalletNotFoundError')
    const type = LEDGER_RULES[purpose]

    // Update wallet balance based on transaction type
    if (type === LEDGER_TYPES.CREDIT) {
      wallet.amount = NumberPrecision.plus(wallet.amount, amount)
    }
    else {
      if (wallet.amount < amount) return
      wallet.amount = NumberPrecision.minus(wallet.amount, amount)
    }    // Create the transaction record

    const ledgerData = {
      purpose,
      amount,
      currencyId: wallet.currencyId,
      transactionType: LEDGER_TRANSACTION_TYPE.STANDARD,
      transactionId: txn.id,
      [type === LEDGER_TYPES.CREDIT ? 'toWalletId' : 'fromWalletId']: wallet.id,
      createdAt: txn.createdAt,
      updatedAt: txn.updatedAt
    }

    // Create the ledger entry for this transaction
    await sequelize.models.ledger.create(ledgerData, { transaction })

    // Save updated wallet balance
    await wallet.save({ transaction })
    return txn

  } catch (error) {
    console.error(`Error creating transaction for user ${userId}:`, error)
    throw error
  }
}

async function runner() {
  const transaction = await sequelize.transaction()
  const rtransaction = await sequelize.transaction()

  console.log(transaction.id)
  console.log(rtransaction.id)
  try {
    await Promise.all(workerData.convertedUsers.flatMap(async (user) => {
      for (let i = 0; i < workerData.count; i++) {
        try {
          const purchasePurpose = LEDGER_PURPOSE.PURCHASE
          const sweepPackage = (customFaker.helpers.arrayElement(workerData.packages)).dataValues
          // console.log(sweepPackage, "=============================================")
          // Create purchase transaction
          const date = customFaker.date.between({ from: workerData.timePeriod.fromDate, to: workerData.timePeriod.toDate })

          const txn = await sequelize.models.transaction.create({
            userId: user.id,
            status: TRANSACTION_STATUS.COMPLETED,
            packageId: sweepPackage.id,
            createdAt: date,
            updatedAt: date
          }, { transaction })


          await createTxn(
            user.id,
            SWEEPS_COINS.PSC,
            sweepPackage.amount,
            purchasePurpose,
            txn,
            transaction
          )
          await createTxn(
            user.id,
            SWEEPS_COINS.GC,
            +sweepPackage.amount * 2.5,
            purchasePurpose,
            txn,
            transaction
          )

        } catch (error) {
          console.error(`Error processing transaction for user ${user.id}:`, error)
        }
      }
      for (let i = 0; i < workerData.count; i++) {
        try {
          const redeemPurpose = LEDGER_PURPOSE.REDEEM

          const date = customFaker.date.between({ from: workerData.timePeriod.fromDate, to: workerData.timePeriod.toDate })

          const rtxn = await sequelize.models.transaction.create({
            userId: user.id,
            status: TRANSACTION_STATUS.COMPLETED,
            createdAt: date,
            updatedAt: date
          }, { transaction: rtransaction })
          // Create redeem transaction
          await createTxn(
            user.id,
            SWEEPS_COINS.RSC,
            customFaker.number.float({ multipleOf: 1, min: 5, max: 25 }),
            redeemPurpose,
            rtxn,
            rtransaction
          )

        } catch (error) {
          console.log("=================================================================================================")
          console.error(`Error processing transaction for user ${user.id}:`, error)
        }
      }
    }))
    await transaction.commit()
    await rtransaction.commit()
    parentPort.postMessage('banking worker finished ' + threadId)
  } catch (error) {
    console.error('Error in runner:', error)
    await transaction.rollback()
    await rtransaction.rollback()
  }
}

console.log('STARTED BANKING WORKER', threadId)
runner()
