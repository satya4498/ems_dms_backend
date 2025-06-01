import { StoreController } from '@src/rest-resources/controllers/store.controlller'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { resources } from '@src/utils/constants/permission.constant'

const supportedFileFormat = ['png', 'jpg', 'jpeg']
const storeRouter = express.Router({ mergeParams: true })

// GET
storeRouter.get('/package', requestValidationMiddleware({}), isAuthenticated(resources.package.read), StoreController.getPackage, responseValidationMiddleware({}))
storeRouter.get('/packages', requestValidationMiddleware({}), isAuthenticated(resources.package.read), StoreController.getPackages, responseValidationMiddleware({}))


// POST
storeRouter.post('/create-package',  requestValidationMiddleware({}), isAuthenticated(resources.package.create), fileUpload(supportedFileFormat).single('file'), StoreController.createPackage, responseValidationMiddleware({}))
storeRouter.post('/update-package',  requestValidationMiddleware({}), isAuthenticated(resources.package.update), fileUpload(supportedFileFormat).single('file'), StoreController.updatePackage, responseValidationMiddleware({}))
storeRouter.post('/reorder-package', requestValidationMiddleware({}), isAuthenticated(resources.package.update), StoreController.reorderPackage, responseValidationMiddleware({}))


// DELETE
storeRouter.delete('/delete-package', requestValidationMiddleware({}), isAuthenticated(resources.package.delete), StoreController.deletePackage, responseValidationMiddleware({}))
export { storeRouter }
