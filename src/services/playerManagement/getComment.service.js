import { APIError } from '@src/errors/api.error';
import ajv from '@src/libs/ajv';
import { ServiceBase } from '@src/libs/serviceBase';


const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    userId: { type: 'string' },
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'username', 'createdAt'], default: 'createdAt' },
  },
});

export class GetCommentService extends ServiceBase {
    get constraints() {
        return constraints
      }
    
  
    async run() {
      const { page, perPage, userId, searchString, fromDate, toDate, order, orderBy } = this.args;
  
      let whereClause = '';
      const replacements = {};

      if (fromDate && toDate) {
        whereClause += ` AND uc.created_at BETWEEN :fromDate AND :toDate`;
        replacements.fromDate = fromDate;
        replacements.toDate = toDate;
      }
      if (userId) {
        whereClause += ` AND uc.user_id = :userId`;
        replacements.userId = userId;
      }
      if (searchString) {
        whereClause += ` AND (u.username LIKE :searchString OR uc.title LIKE :searchString OR uc.comment LIKE :searchString)`;
        replacements.searchString = `%${searchString}%`;
      }
  
      try {
        const baseQuery = `
          SELECT
            uc.id AS commentId,
            u.username AS username,
            uc.title AS title,
            uc.comment AS note,
            admUser.username AS commenterId,
            uc.created_at AS createdAt,
            uc.updated_at AS updatedAt
          FROM
            public.user_comments AS uc
          INNER JOIN
            public.users AS u ON u.id = uc.user_id
          INNER JOIN
            public.admin_users AS admUser ON uc.commenter_id = admUser.id
          WHERE 1=1
            ${whereClause}
          ORDER BY ${orderBy} ${order}
          LIMIT :limit OFFSET :offset;
        `;
  
        const countQuery = `
          SELECT COUNT(*) AS totalCount
          FROM public.user_comments AS uc
          INNER JOIN public.users AS u ON u.id = uc.user_id
          INNER JOIN public.admin_users AS admUser ON uc.commenter_id = admUser.id
          WHERE 1=1
            ${whereClause};
        `;
  
        replacements.limit = perPage;
        replacements.offset = (page - 1) * perPage;
  
        const [comments, totalCount] = await Promise.all([
          this.context.sequelize.query(baseQuery, { replacements, type: this.context.sequelize.QueryTypes.SELECT }),
          this.context.sequelize.query(countQuery, { replacements, type: this.context.sequelize.QueryTypes.SELECT }),
        ]);
        
        return {
          comments,
          totalCount,
          page,
          totalPages: Math.ceil(totalCount[0].totalcount / perPage),
        };
      } catch (error) {
        throw new APIError(error);
      }
    }
  }
  



