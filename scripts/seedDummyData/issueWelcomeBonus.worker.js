// const { parentPort, workerData, threadId } = require('worker_threads')
const { sequelize } = require('../../src/database/models')
const { Faker, es } = require('@faker-js/faker')
const { NumberPrecision } =require('@src/libs/numberPrecision')
const { USER_BONUS_STATUS_VALUES } = require('@src/utils/constants/bonus.constants.utils')
const { LEDGER_PURPOSE, LEDGER_RULES, LEDGER_TYPES, TRANSACTION_STATUS, LEDGER_TRANSACTION_TYPE } = require('@src/utils/constants/public.constants.utils')

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

export async function runner(workerData) {
  const transaction = await sequelize.transaction()


  try {
    await Promise.all(workerData.convertedUsers.flatMap(async (user) => {
        try {

          // get user bonus
          const userBonus = await sequelize.models.userBonus.findOne({
            where: {
              userId: user.id,
              bonusId: workerData.welcomeBonus.id
            }
          })
          
          if(userBonus) return null

          const purchasePurpose = LEDGER_PURPOSE.BONUS_CASHED
          const date = customFaker.date.between({ from: workerData.timePeriod.fromDate, to: workerData.timePeriod.toDate })

          const txn = await sequelize.models.transaction.create({
            userId: user.id,
            status: TRANSACTION_STATUS.COMPLETED,
            createdAt: date,
            updatedAt: date
          }, { transaction })

          // create ledge for every transaction
          for (const bonusCurrency of workerData.welcomeBonus.bonusCurrencies) {

            const amount = bonusCurrency.joiningAmount
    
            // create ledger
            await createTxn(
              user.id,
              bonusCurrency.currency.code,
              amount,
              purchasePurpose,
              txn,
              transaction
            )
          }
    
          await sequelize.models.userBonus.create({
            bonusId: workerData.welcomeBonus.id,
            userId: user.id,
            transactionId: txn.id,
            status: USER_BONUS_STATUS_VALUES.CLAIMED,
            claimedAt: date
          }, { transaction})

        } catch (error) {
          console.error(`Error issuing bonus for user ${user.id}:`, error)
        }
    }))
    await transaction.commit()
    return true
  } catch (error) {
    console.error('Error in runner:', error)
    await transaction.rollback()
    return false
  }
}

