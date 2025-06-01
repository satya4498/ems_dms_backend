import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tournamentId: { type: 'number' }
  },
  required: ['tournamentId']
})

export class ToggleTournamentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const tournament = await this.context.sequelize.models.casinoTournament.findOne({
        attributes: ['id', 'status', 'isActive'],
        where: { id: this.args.tournamentId }
      })
      if (!tournament) return this.addError('TournamentDoesNotExistErrorType')

      tournament.status = tournament.status === STATUS.INACTIVE ? STATUS.ACTIVE : STATUS.INACTIVE
      tournament.isActive = !tournament.isActive
      await tournament.save()

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
