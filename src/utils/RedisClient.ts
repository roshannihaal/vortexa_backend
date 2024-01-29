import { createClient, RedisClientType } from 'redis'
import { config } from '../config'
import { getJwtExpiry } from './Jwt'
import _ from 'lodash'
import { RedisSessionObject } from './utils.dto'

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
    const key = `${userId}_${sessionId}_${tokenExpTime}`
    const value = JSON.stringify({ token, exp: tokenExpTime })
    await redisClient.set(key, value, { EXAT: tokenExpTime })
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
    const parsedSessions = parseData(sessions)

    const oldestSession = _.minBy(parsedSessions, 'tokenExpTime')

    if (oldestSession) {
      const key = getKeyFromObject(oldestSession)

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

const parseData = (data: string[]) => {
  const parsedData = data.map((item) => {
    const splitData = item.split('_')
    return {
      userId: splitData[0],
      sessionId: splitData[1],
      tokenExpTime: parseInt(splitData[2]),
    }
  })
  return parsedData
}

const getKeyFromObject = (data: RedisSessionObject) => {
  const stringifiedData = `${data.userId}_${data.sessionId}_${data.tokenExpTime}`
  return stringifiedData
}
