import { createClient, RedisClientType } from 'redis'
import { config } from '../config'

const redisHost = config.REDIS_HOST
const redisPort = config.REDIS_EXPOSE_PORT

const redisClient: RedisClientType = createClient({
  url: `redis://${redisHost}:${redisPort}`,
})

export const connectToRedis = async () => {
  await redisClient.connect()
}
