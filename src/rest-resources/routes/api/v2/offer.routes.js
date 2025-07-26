import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { OfferController } from '@src/rest-resources/controllers/offer.controller'
import { USER_ROLE } from '@src/utils/constants/public.constants.utils'
import { createOfferSchema, getOffersSchema, getOfferSchema, updateOfferSchema, deleteOfferSchema } from '@src/schema/offer'

const offerRouter = express.Router({ mergeParams: true })

// Offer Management (Admin only)
offerRouter.post('/',
  isAuthenticated(USER_ROLE.ADMIN),
  requestValidationMiddleware(createOfferSchema),
  OfferController.create,
  responseValidationMiddleware({})
)

offerRouter.get('/',
  isAuthenticated(),
  requestValidationMiddleware(getOffersSchema),
  OfferController.getAll,
  responseValidationMiddleware({})
)

offerRouter.get('/:id',
  isAuthenticated(),
  requestValidationMiddleware(getOfferSchema),
  OfferController.getById,
  responseValidationMiddleware({})
)

offerRouter.put('/:id',
  isAuthenticated(USER_ROLE.ADMIN),
  requestValidationMiddleware(updateOfferSchema),
  OfferController.update,
  responseValidationMiddleware({})
)

offerRouter.delete('/:id',
  isAuthenticated(USER_ROLE.ADMIN),
  requestValidationMiddleware(deleteOfferSchema),
  OfferController.delete,
  responseValidationMiddleware({})
)

export { offerRouter }
