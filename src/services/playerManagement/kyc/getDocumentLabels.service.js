import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { PLAYER_MANAGEMENT_KYC_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    searchString: { type: 'string' },
    isRequired: { type: 'boolean' },
    page: { type: 'number', minimum: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'name', 'isRequired'], default: 'id' }
  }
})

export class GetDocumentLabelsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
    const page = this.args.page
    const perPage = this.args.perPage
    const isRequired = this.args.isRequired
    const searchString = this.args.searchString

    try {
      const where = {}
      if (isRequired) where.required = isRequired
      if (searchString) where.name = { [Op.like]: `%${searchString}%` }

      const documentLabels = await this.context.sequelize.models.documentLabel.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        ...(userId
          ? {
              include: {
                model: this.context.sequelize.models.document,
                where: { userId },
                required: false,
                include: {
                  attributes: ['username', 'email'],
                  model: this.context.sequelize.models.adminUser,
                  required: false
                }
              }
            }
          : {}),
        ...(page && perPage ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [[this.args.orderBy, this.args.order]]
      })
 // Initialize overall KYC status and track the latest rejection globally
       let overallKycStatus = PLAYER_MANAGEMENT_KYC_STATUS.UPLOAD_ALL_REQUIRED_DOCUMENTS
       let latestRejectionDescription = null;
       let latestRejectionDate = null;
       let allRequiredApproved = true;
       let hasRejected = false;
       let hasPendingRequired = false;
      
       const updatedDocumentLabels = documentLabels.rows.map((label) => {
       const labelData = label.get({ plain: true })
        
         if (!label.documents || label.documents.length === 0) {
         if (label.required) allRequiredApproved = false;
            return labelData;
          }

         let labelHasRejected = false;
         let labelLatestRejectionDate = null;
         let labelLatestRejectionDescription = null;
         let labelHasPending = false;

   label.documents.forEach((doc) => {
     const docRejectionDate = doc.updatedAt || doc.createdAt; // Use the timestamps to determine recency

           if (doc.status === 'rejected') {
             labelHasRejected = true;
             hasRejected = true
             allRequiredApproved = false;
            
            if (!labelLatestRejectionDate || docRejectionDate > labelLatestRejectionDate) {
                 labelLatestRejectionDate = docRejectionDate;
                 labelLatestRejectionDescription = doc.kycRejectDescription;
             }

       // Check for the latest rejection globally
            if (!latestRejectionDate || docRejectionDate > latestRejectionDate) {
                 latestRejectionDate = docRejectionDate;
                 latestRejectionDescription = doc.kycRejectDescription;
             }
           } else if (doc.status === 'pending') {
                labelHasPending = true;
               if (label.required) hasPendingRequired = true;
             }
           });

        if (label.required && (labelHasRejected || labelHasPending)) {
          allRequiredApproved = false;
        }

        return {
          ...labelData,
          latestRejectionDescription: labelLatestRejectionDescription
        };
      });

      if (hasRejected) {
        overallKycStatus = 'rejected';
      } else if (hasPendingRequired) {
        overallKycStatus = 'pending';
      } else if (allRequiredApproved) {
        overallKycStatus = 'approved';
      }

       return {
        documentLabels: {
           kycStatus: overallKycStatus,
           rejectionDescription: latestRejectionDescription, // Only the latest rejection globally
           documentLabels: updatedDocumentLabels,
           page,
           totalPages: Math.ceil(documentLabels.count / perPage)
         },
         errors: []
       }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
