import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { QUERY_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 10 },
    status: { enum: Object.values(QUERY_STATUS) },
    username: { type: 'string' }
  }
})

export class GetUserDisputesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { page, perPage, status, username } = this.args
      const offset = (page - 1) * perPage // Calculate offset
      const replacements = {
        limit: perPage,
        offset: offset
      }
      let query = `
          SELECT mt.*,
                COUNT(tm.id) AS unread_message_count,
                u.username,
                u.email
          FROM main_threads mt
          LEFT JOIN thread_messages tm ON mt.id = tm.thread_id AND tm.admin_read = false
          LEFT JOIN users u ON mt.user_id = u.id`
      let countQuery = 'SELECT COUNT(*) FROM main_threads mt LEFT JOIN users u ON mt.user_id = u.id '
      const countReplacement = {}
      if (status) {
        query += ' WHERE mt.status = :status'
        replacements.status = status
        countQuery += ' WHERE status = :status'
        // countQuery += ` WHERE status = ${status}`
        countReplacement.replacements = { status }
      }
      if (username) {
        query += ' AND u.username ILIKE  :username'
        countQuery += ' AND u.username ILIKE  :username'
        replacements.username = `%${username}%`
        countReplacement.replacements.username = `%${username}%`
      }
      query += `
      GROUP BY mt.id, u.username, u.email
      ORDER BY mt.created_at DESC
      LIMIT :limit OFFSET :offset;
      `
      const threadTickets = await this.context.sequelize.query(query, {
        replacements: replacements,
        type: this.context.sequelize.QueryTypes.SELECT
      })
      countReplacement.type = this.context.sequelize.QueryTypes.SELECT
      const [{ count: ticketsCount }] = await this.context.sequelize.query(countQuery, countReplacement)
      return { threadTickets: threadTickets, page, totalPages: Math.ceil(ticketsCount / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
