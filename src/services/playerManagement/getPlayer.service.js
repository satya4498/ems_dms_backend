import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    playerId: { type: 'string' }
  },
  required: ['playerId']
})

export class GetPlayerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const playerStatsQuery = `SELECT
            u.username AS username,
            u.id AS userId,
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "gcStakedAmount",
            COUNT(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id = 1 THEN l.id
                ELSE NULL
            END) AS "gcBetCount",
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "scStakedAmount",
            COUNT(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != 1 THEN l.id
                ELSE NULL
            END) AS "scBetCount",
            ROUND(SUM(CASE
                WHEN l.purpose IN ('${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}') AND l.currency_id != 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "scCasinoWins",
            ROUND(SUM(CASE
                WHEN l.purpose IN ('${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}') AND l.currency_id = 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "gcCasinoWins",
            SUM(CASE
                WHEN l.purpose IN ('${LEDGER_PURPOSE.TOURNAMENT_ENROLL}', '${LEDGER_PURPOSE.TOURNAMENT_REBUY}') THEN l.amount
                ELSE 0
            END) AS "tournamentEnrollments",
            ROUND(SUM(CASE
                WHEN l.purpose IN ('${LEDGER_PURPOSE.TOURNAMENT_WIN}', '${LEDGER_PURPOSE.TOURNAMENT_CANCEL}') THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "tournamentPayouts",
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE}' AND l.currency_id != 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "gcPurchases",
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE}' AND l.currency_id = 1 THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "scRewards",
            ROUND(SUM(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.REDEEM}' THEN l.amount
                ELSE 0
            END)::numeric, 2) AS "redeemAmount",
            COUNT(CASE
                WHEN l.purpose = '${LEDGER_PURPOSE.PURCHASE}' THEN l.id
                ELSE NULL
            END) AS "purchaseCount",
            ROUND((
              SUM(CASE
                  WHEN l.purpose = '${LEDGER_PURPOSE.CASINO_BET}' AND l.currency_id != 1 THEN l.amount
                  ELSE 0
              END) -
              SUM(CASE
                  WHEN l.purpose IN ('${LEDGER_PURPOSE.CASINO_WIN}', '${LEDGER_PURPOSE.CASINO_REFUND}') AND l.currency_id != 1 THEN l.amount
                  ELSE 0
              END)
            )::numeric, 2) AS "netProfit"
          FROM
            ledgers AS l
            JOIN wallets AS w ON l.from_wallet_id = w.id OR l.to_wallet_id = w.id
            JOIN users AS u ON w.user_id = u.id
        WHERE u.id = '${this.args.playerId}' GROUP BY u.id, u.username;`

      const [playerDetailResult, playerStatsResult] = await Promise.all([this.context.sequelize.models.user.findOne({
        attributes: { exclude: ['password', 'updatedAt'] },
        where: { id: this.args.playerId },
        include: [{
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.wallet,
          include: {
            model: this.context.sequelize.models.currency,
            attributes: ['code', 'isDefault']
          }
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'lastLoggedInIp', 'loggedInAt', 'publicAddress'] },
          model: this.context.sequelize.models.user,
          as: 'referral'
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.userLimit
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.userComment,
          include: {
            attributes: ['username'],
            model: this.context.sequelize.models.adminUser
          }
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.userTag,
          include: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.tag
          }
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.document,
          include: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.documentLabel
          }
        }, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.address
        },
        {
          model: this.context.sequelize.models.userMetaData,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        },
        {
          model: this.context.sequelize.models.state,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
        ]
      }),
      this.context.sequelize.query(playerStatsQuery, { type: this.context.sequelize.QueryTypes.SELECT })
      ])

      if (!playerDetailResult) return this.addError('UserDoesNotExistsErrorType')

      return { user: playerDetailResult, playerStats: playerStatsResult }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
