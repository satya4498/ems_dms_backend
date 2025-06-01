import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { EVENT_STATUS } from '@src/utils/constants/sportbookManagement.constants'
import { isBoolean } from 'lodash'
import { Op, Sequelize } from 'sequelize'

const orderByEnum = {
  ID: 'id',
  SPORT: 'sport',
  STATUS: 'status',
  LEAGUE: 'league',
  LOCATION: 'location',
  START_DATE: 'startDate',
  FIXTURE_ID: 'fixtureId',
  PARTICIPANT: 'participant'
}

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    leagueId: { type: 'string' },
    sportId: { type: 'string' },
    locationId: { type: 'string' },
    searchString: { type: 'string' },
    bettingEnabled: { type: 'boolean' },
    status: { enum: Object.values(EVENT_STATUS) },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: Object.values(orderByEnum), default: 'fixtureId' }
  }
})

export class GetEventsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const sportId = this.args.sportId
    const leagueId = this.args.leagueId
    const locationId = this.args.locationId
    const searchString = this.args.searchString
    const bettingEnabled = this.args.bettingEnabled
    const order = this.args.order
    const orderBy = this.args.orderBy
    const status = this.args.status

    try {
      const sportFilter = {}
      const leagueFilter = { where: {} }
      const locationFilter = { where: {} }
      const eventFilter = { where: {} }

      if (searchString) {
        const finalSearchString = `%${searchString}%`
        eventFilter.where[Op.or] = [
          // Sequelize.where(Sequelize.literal('"eventParticipant->participants"."name"'), 'iLike', finalSearchString),
          Sequelize.where(Sequelize.literal('"league"."name"'), 'iLike', finalSearchString),
          Sequelize.where(Sequelize.literal('"league->sport"."name"'), 'iLike', finalSearchString),
          Sequelize.where(Sequelize.literal('"league->location"."name"'), 'iLike', finalSearchString)
        ]
      }

      if (status) eventFilter.where.status = status
      if (isBoolean(bettingEnabled)) eventFilter.where.bettingEnabled = bettingEnabled
      if (leagueId) leagueFilter.where.id = leagueId
      if (sportId) leagueFilter.where.sportId = sportId
      if (locationId) leagueFilter.where.locationId = locationId
      if (orderBy === orderByEnum.SPORT) sportFilter.order = [['name', order]]
      if (orderBy === orderByEnum.LEAGUE) leagueFilter.order = [['name', order]]
      if (orderBy === orderByEnum.LOCATION) locationFilter.order = [['name', order]]
      if (orderBy === orderByEnum.PARTICIPANT) locationFilter.order = [['name', order]]
      else eventFilter.order = [[orderBy, order]]

      const events = await this.context.sequelize.models.event.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        ...eventFilter,
        include: [{
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.league,
          ...leagueFilter,
          required: true,
          include: [{
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.sport,
            ...sportFilter,
            required: true
          }, {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.location,
            ...locationFilter,
            required: true
          }]
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.eventParticipant,
          include: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.participant,
            required: true
          },
          required: true,
          separate: true
        }],
        limit: perPage,
        offset: (page - 1) * perPage
      })

      return { events: events.rows, page, totalPages: Math.ceil(events.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
