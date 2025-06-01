import { BannerController } from '@src/rest-resources/controllers/contentManagement/banner.controller'
import { EmailTemplateController } from '@src/rest-resources/controllers/contentManagement/emailTemplate.controller'
import { GalleryController } from '@src/rest-resources/controllers/contentManagement/gallery.controller'
import { PageController } from '@src/rest-resources/controllers/contentManagement/page.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'
import { successSchema } from '@src/schema/successResponse.schema'
import { createPageSchema } from '@src/schema/content/createPage.schema'
import { createEmailTemplateSchema } from '@src/schema/content/createEmailTemplate.schema'
import { galleryUploadSchema } from '@src/schema/content/galleryUpload.schema'
import { bannerDeleteSchema } from '@src/schema/content/bannerDelete.schema'
import { getPageSchema } from '@src/schema/content/getPage.schema'
import { getEmailTemplateSchema } from '@src/schema/content/geteEmailTemplate.schema'
import { getGallerySchema } from '@src/schema/content/getGallery.schema'
const supportedFileFormats = ['jpeg', 'png', 'svg', 'webp']
const supportedVideoFormats = ['mp4', 'webm', 'mkv', 'avi', 'wmv']

const contentManagementRoutes = express.Router({ mergeParams: true })

// GET REQUESTS
contentManagementRoutes.get('/page', isAuthenticated(resources.page.read), PageController.getPage, responseValidationMiddleware(createPageSchema))
contentManagementRoutes.get('/pages', isAuthenticated(resources.page.read), PageController.getPages, responseValidationMiddleware(getPageSchema))
contentManagementRoutes.get('/banner/types', isAuthenticated(resources.banner.read), BannerController.getBannersTypes, responseValidationMiddleware({}))
contentManagementRoutes.get('/banners/', isAuthenticated(resources.banner.read), BannerController.getBanners, responseValidationMiddleware({}))
contentManagementRoutes.get('/gallery', GalleryController.getImages, responseValidationMiddleware(getGallerySchema))
contentManagementRoutes.get('/email-templates', isAuthenticated(), EmailTemplateController.getEmailTemplates, responseValidationMiddleware(getEmailTemplateSchema))
contentManagementRoutes.get('/email-template', isAuthenticated(), EmailTemplateController.getEmailTemplate, responseValidationMiddleware({}))

// // POST REQUESTS
contentManagementRoutes.post('/page/update', isAuthenticated(resources.page.update), PageController.updatePage, responseValidationMiddleware(createPageSchema))
contentManagementRoutes.post('/page/create', isAuthenticated(resources.page.create), PageController.createPage, responseValidationMiddleware(createPageSchema))
contentManagementRoutes.post('/page/toggle', isAuthenticated(resources.page.toggle_status), PageController.togglePage, responseValidationMiddleware(successSchema))
contentManagementRoutes.post('/email/update', isAuthenticated(), EmailTemplateController.updateEmailTemplate, responseValidationMiddleware(createEmailTemplateSchema))
contentManagementRoutes.post('/email/create', isAuthenticated(), EmailTemplateController.createEmailTemplate, responseValidationMiddleware(createEmailTemplateSchema))
contentManagementRoutes.post('/email/set-default', isAuthenticated(), EmailTemplateController.setDefaultEmailTemplate, responseValidationMiddleware(createEmailTemplateSchema))

contentManagementRoutes.post('/banner/create', isAuthenticated(resources.banner.create), fileUpload(supportedFileFormats, supportedVideoFormats).fields([{ name: 'mobileImage', maxCount: 1 }, { name: 'desktopImage', maxCount: 1 }]), BannerController.createBannerController, responseValidationMiddleware({}))

contentManagementRoutes.post('/banner/update', isAuthenticated(resources.banner.update), fileUpload(supportedFileFormats, supportedVideoFormats).fields([{ name: 'mobileImage', maxCount: 1 }, { name: 'desktopImage', maxCount: 1 }]), BannerController.updateBannerController, responseValidationMiddleware({}))
contentManagementRoutes.post('/banner/reorder', isAuthenticated(resources.banner.update), BannerController.reorderBanners, responseValidationMiddleware({}))

contentManagementRoutes.post('/gallery/upload', isAuthenticated(resources.gallery.update), fileUpload(supportedFileFormats).single('file'), GalleryController.uploadGalleryImage, responseValidationMiddleware(galleryUploadSchema))

// // DELETE REQUESTS
contentManagementRoutes.delete('/page', isAuthenticated(resources.page.delete), PageController.deletePage, responseValidationMiddleware(successSchema))
contentManagementRoutes.delete('/banner', isAuthenticated(resources.banner.delete), BannerController.deleteBanner, responseValidationMiddleware(bannerDeleteSchema))
contentManagementRoutes.delete('/gallery', isAuthenticated(resources.gallery.delete), GalleryController.deleteGalleryImage, responseValidationMiddleware(successSchema))
contentManagementRoutes.delete('/email', isAuthenticated(), EmailTemplateController.deleteEmailTemplate, responseValidationMiddleware(successSchema))

export { contentManagementRoutes }
