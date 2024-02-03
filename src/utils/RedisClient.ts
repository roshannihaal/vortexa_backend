import { createClient, RedisClientType } from 'redis'
import { config } from '../config'
import { getJwtExpiry } from './Jwt'
import _ from 'lodash'
import { RedisSessionArray, RedisSessionObject } from './utils.dto'

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
    const value = { token }

    await redisClient.json.set(key, '$', value)
    await redisClient.expireAt(key, tokenExpTime)
  } catch (error) {
    throw error
  }
}

export const isMaxSessionsReached = async (userId: string) => {
  try {
    const sessions = await getAllSessions(userId)
    if (sessions.length >= config.MAX_SESSIONS) {
      return true
    }
    return false
  } catch (error) {
    throw error
  }
}

export const removeOldestSession = async (userId: string) => {
  try {
    const sessions = await getAllSessions(userId)

    const multi = redisClient.multi()
    for (let session of sessions) {
      multi.json.get(session)
    }

    const tokens = RedisSessionObject.parse(await multi.exec())

    const sessionArray: RedisSessionArray = sessions.map((key, index) => {
      return {
        key,
        token: tokens[index].token,
      }
    })

    const oldestSession = _.minBy(sessionArray, (data) => {
      return getJwtExpiry(data.token)
    })

    if (oldestSession) {
      await redisClient.del(oldestSession.key)
    }
  } catch (error) {
    throw error
  }
}

export const getCurrentSession = async (userId: string, sessionId: string) => {
  try {
    const pattern = `${userId}_${sessionId}`
    const allSessions = await getAllSessions(userId)
    const currentSession = allSessions.find((session) =>
      session.startsWith(pattern),
    )
    return currentSession
  } catch (error) {
    throw error
  }
}

export const removeCurrentSession = async (
  userId: string,
  sessionId: string,
) => {
  try {
    const key = await getCurrentSession(userId, sessionId)
    if (key) {
      await redisClient.del(key)
    }
  } catch (error) {
    throw error
  }
}

const getAllSessions = async (userId: string) => {
  try {
    const pattern = `${userId}_`
    const { keys } = await redisClient.scan(0, { MATCH: `${pattern}*` })
    return keys
  } catch (error) {
    throw error
  }
}
