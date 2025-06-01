import { APIError } from '@src/errors/api.error'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { AMOE_STATUS } from '@src/utils/constants/public.constants.utils'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
    type: 'object',
    properties: {
        userId: { type: 'string' },
        fromDate: { type: 'string' },
        searchString: { type: 'string' },
        toDate: { type: 'string' },
        status: { enum: Object.values(AMOE_STATUS) },
        page: { type: 'number', minimum: 1, default: 1 },
        perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
    }
})

export class GetAllAmoEntriesService extends ServiceBase {
    get constraints() {
        return constraints
    }

    async run() {
        const userId = this.args.userId
        const searchString = this.args.searchString
        const status = this.args.status
        const page = this.args.page
        const fromDate = this.args.fromDate
        const toDate = this.args.toDate
        const perPage = this.args.perPage

        try {
            const where = {}
            const nestedWhere = {}
            if (status) where.status = status
            if (userId) where.userId = userId
            if (fromDate || toDate) {
                const dateFilter = alignDatabaseDateFilter(fromDate, toDate)
                where.createdAt = dateFilter
            }

            if (searchString) {
                const finalSearchString = `%${searchString}%`
                if (!isNaN(searchString) && searchString.trim() !== '') {
                    nestedWhere['id'] = searchString
                } else {
                nestedWhere[Op.or] = [
                        Sequelize.where(Sequelize.fn('concat', Sequelize.col('user.first_name'), ' ', Sequelize.col('user.last_name')), 'ILIKE', finalSearchString),
                        { '$user.username$': { [Op.iLike]: finalSearchString } },
                        { '$user.email$': { [Op.iLike]: finalSearchString } },
                        { '$user.phone$': { [Op.iLike]: finalSearchString } }
                ]
                }
            }
            const amoEntries = await this.context.sequelize.models.amoEntry.findAndCountAll({
                attributes: { exclude: ['updatedAt', 'password'] },
                where,
                include: {
                    attributes: ['email', 'username', 'id', 'first_name'],
                    model: this.context.sequelize.models.user,
                    where: nestedWhere
                },
                limit: perPage,
                offset: (page - 1) * perPage,
                order: [
                    ['createdAt', 'DESC'],
                ],
            })

            return { amoEntries: amoEntries.rows, page, totalPages: Math.ceil(amoEntries.count / perPage) }
        } catch (error) {
            throw new APIError(error)
        }
    }
}
