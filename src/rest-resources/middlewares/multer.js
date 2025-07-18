import RequestInputValidationError from '@src/errors/requestInputValidation.error'
import { errorTypes } from '@src/utils/constants/error.constants'
import multer from 'multer'

/**
 * @param {array} supportedFileFormats
 */
export function fileUpload (supportedFileFormats = [], allowedVideoFormats = []) {
  supportedFileFormats = supportedFileFormats.map(fileFormat => `image/${fileFormat}`)
  allowedVideoFormats = allowedVideoFormats.map(fileFormat => `video/${fileFormat}`)
  const upload = multer({
    limits: { fileSize: 1000000 * 10 }, // 10mbs
    fileFilter: (_, file, next) => {
      if ((supportedFileFormats.length && !supportedFileFormats.includes(file.mimetype)) && (allowedVideoFormats.length && !allowedVideoFormats.includes(file.mimetype))) return next(new RequestInputValidationError(errorTypes.FileFormatNotSupportedErrorType), true)
      next(null, true)
    }
  })

  return upload
}
