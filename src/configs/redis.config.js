import { config } from './config'

const username = config.get('redis_db.username')
const password = config.get('redis_db.password')
const tlsEnabled = config.get('redis_db.tls')

/** @type {import('ioredis').RedisOptions} */
export const redisOptions = {
  host: config.get('redis_db.host'),
  port: config.get('redis_db.port'),
  ...(username ? { username } : {}),
  ...(password ? { password } : {}),
  ...(tlsEnabled ? { tls: { rejectUnauthorized: false } } : {})
}
