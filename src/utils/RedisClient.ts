import { createClient, RedisClientType } from 'redis'
import { config } from '../config'
import { getJwtExpiry } from './Jwt'

const redisHost = config.REDIS_HOST
const redisPort = config.REDIS_EXPOSE_PORT

const redisClient: RedisClientType = createClient({
  url: `redis://${redisHost}:${redisPort}`,
})

export const connectToRedis = async () => {
  await redisClient.connect()
}

export const addNewSession = async (
  userId: string,
  sessionId: string,
  token: string,
) => {
  try {
    const tokenExpTime = getJwtExpiry(token)
    const key = `${userId}_${sessionId}`
    await redisClient.set(key, token, { EXAT: tokenExpTime })
  } catch (error) {
    throw error
  }
}

export const isMaxSessionsReached = async (userId: string) => {
  try {
    const pattern = `${userId}_`

    const { keys } = await redisClient.scan(0, { MATCH: `${pattern}*` })
    if (keys.length >= config.MAX_SESSIONS) {
      return true
    }
    return false
  } catch (error) {
    throw error
  }
}
