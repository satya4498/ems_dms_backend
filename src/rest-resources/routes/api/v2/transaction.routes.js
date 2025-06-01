import { TransactionController } from '@src/rest-resources/controllers/transaction.controller'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { getBankingTransactionSchema } from '@src/schema/transaction/bankingTransaction.schema'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { resources } from '@src/utils/constants/permission.constant'
import { ReportsController } from '@src/rest-resources/controllers/reoports.controller'

const transactionRouter = express.Router({ mergeParams: true })

// GET REQUESTS
transactionRouter.get('/casino-transactions', isAuthenticated(resources.reportCasinoTransaction.read), TransactionController.getCasinoTransactions, responseValidationMiddleware({}))
transactionRouter.get('/banking-transactions', isAuthenticated(resources.reportTransaction.read), TransactionController.getBankingTransactions, responseValidationMiddleware(getBankingTransactionSchema))
transactionRouter.get('/ledgers', isAuthenticated(resources.reportLedger.read), TransactionController.getLedgers, responseValidationMiddleware({}))
transactionRouter.get('/report', isAuthenticated(), ReportsController.getReport, responseValidationMiddleware({}))
transactionRouter.post('/report', isAuthenticated(), ReportsController.exportReport, responseValidationMiddleware({}))

export { transactionRouter }
