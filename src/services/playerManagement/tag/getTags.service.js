import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchString: { type: 'string' },
    segment: { type: 'boolean', default: false },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'tag', 'createdAt'], default: 'createdAt' }
  }
})

export class GetTagsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {page, perPage, searchString, segment} = this.args

    try {
      let segmentationNames = []
      if(!segment){
      const segmentations = await this.context.sequelize.models.segmentation.findAll({
        attributes: ['name'],
        raw: true
      })

       segmentationNames = segmentations && segmentations.map(segment => segment?.name)
    }
      const where = {
        [Op.and]: [
          { tag: { [Op.notIn]: segmentationNames } },  // Exclude segmentation names
          searchString ? { tag: { [Op.like]: `%${searchString}%` } } : {} // Apply search filter if exists
        ]
      }

      let tagQuery = {
        where,
        order: [[this.args.orderBy, this.args.order]]
      }

      if ( page && perPage ) tagQuery = { ...tagQuery,
        limit: perPage,
        offset: (page - 1) * perPage,
       }

      const tags = await this.context.sequelize.models.tag.findAndCountAll(tagQuery)

      return { tags: tags.rows, page, totalPages: Math.ceil(tags.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
