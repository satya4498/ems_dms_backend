import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
    type: 'object',
    properties: {
        page: { type: 'number', minimum: 1, default: 1 },
        perPage: { type: 'number', maximum: 500, default: 10 },
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        ip: {type: 'string'}
    },
})

/**
 * This will give duplicate players from the system
 */
export class GetAllDuplicatePlayersService extends ServiceBase {
    get constraints() {
        return constraints
    }

    async run() {

        const { firstName , lastName, ip, page, perPage} = this.args

        try {

            const filters = [];
            const replacements = {};

            if (firstName) {
                console.log("sss")
                filters.push(`first_name ILIKE :first_name`);
                replacements.first_name = `%${firstName}%`;
            }

            if (lastName) {
                filters.push('last_name ILIKE :last_name');
                replacements.last_name = `%${lastName}%`;
            }

            if (ip) {
                filters.push('last_logged_in_ip = :last_logged_in_ip');
                replacements.last_logged_in_ip = ip;
            }

            const whereClause = filters.length > 0 ? `AND (${filters.join(' AND ')})` : '';

            // get all duplicated users from the data as reports 
            const query = `
            WITH duplicates AS (
                SELECT 
                    id,
                    last_logged_in_ip,
                    first_name,
                    last_name,
                    email,
                    username,
                    is_active,
                    COUNT(*) OVER (PARTITION BY last_logged_in_ip) AS ip_count,
                    COUNT(*) OVER (PARTITION BY first_name, last_name) AS name_count,
                    COUNT(*) OVER (PARTITION BY email) AS email_count,
                    COUNT(*) OVER (PARTITION BY username) AS username_count
                FROM 
                    users
            )
                    
            SELECT DISTINCT 
                id, last_logged_in_ip, first_name, last_name, email, username, is_active
            FROM 
                duplicates
            WHERE 
                (ip_count > 1 OR 
                name_count > 1 OR 
                email_count > 1 OR 
                username_count > 1)
                ${whereClause}
            ORDER BY 
                id
            LIMIT :limit OFFSET :offset;`;

            // run the query for to select 
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: { limit: perPage, offset: (page - 1) * perPage, ...replacements},
            });

            // query for count
            const countQuery = `
                WITH duplicates AS (
                    SELECT 
                        id, last_logged_in_ip, first_name, last_name, email, username,
                        COUNT(*) OVER (PARTITION BY last_logged_in_ip) AS ip_count,
                        COUNT(*) OVER (PARTITION BY first_name, last_name) AS name_count,
                        COUNT(*) OVER (PARTITION BY email) AS email_count,
                        COUNT(*) OVER (PARTITION BY username) AS username_count
                    FROM 
                        users
                )
                        
                SELECT 
                    COUNT(*) AS total_count
                FROM (
                    SELECT DISTINCT 
                        id, last_logged_in_ip, first_name, last_name, email, username
                    FROM 
                        duplicates
                    WHERE 
                        (ip_count > 1 OR 
                        name_count > 1 OR 
                        email_count > 1 OR 
                        username_count > 1)
                        ${whereClause}
                ) AS filtered_duplicates;`;

            const countResults = await sequelize.query(countQuery, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {  first_name: firstName, last_name: lastName, last_logged_in_ip: ip, ...replacements },

            });

            return {
                players: results,
                page,
                totalPages: Math.ceil(countResults[0].total_count / perPage)
            }
        } catch (error) {
            throw new APIError(error)
        }
    }
}
