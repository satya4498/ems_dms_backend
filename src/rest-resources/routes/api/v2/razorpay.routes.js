import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { RazorpayController } from '@src/rest-resources/controllers/razorpay.controller'
import { createContactSchema, addBankAccountSchema, getContactSchema, createPayoutSchema } from '@src/schema/razorpay'

const razorpayRouter = express.Router({ mergeParams: true })

// Contact Management
razorpayRouter.post('/contact/create',
  isAuthenticated(),
  requestValidationMiddleware(createContactSchema),
  RazorpayController.createContact,
  responseValidationMiddleware(createContactSchema)
)

razorpayRouter.get('/contact',
  isAuthenticated(),
  requestValidationMiddleware(getContactSchema),
  RazorpayController.getContact,
  responseValidationMiddleware(getContactSchema)
)

// Bank Account Management
razorpayRouter.post('/bank-account/add',
  isAuthenticated(),
  requestValidationMiddleware(addBankAccountSchema),
  RazorpayController.addBankAccount,
  responseValidationMiddleware(addBankAccountSchema)
)

// Payout Management
razorpayRouter.post('/payout/create',
  isAuthenticated(),
  requestValidationMiddleware(createPayoutSchema),
  RazorpayController.createPayout,
  responseValidationMiddleware(createPayoutSchema)
)

export { razorpayRouter }
