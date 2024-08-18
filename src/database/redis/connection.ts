import type { RedisClientType } from 'redis'
import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

let redisConnected = false

declare global {
  var __redisDb__: RedisClientType
}

const redisConnection = (): {
  connect: () => Promise<RedisClientType>
  disconnect: () => Promise<boolean>
} => {
  return {
    connect: async () => {
      if (!global.__redisDb__) {
        global.__redisDb__ = createClient({
          url: process.env.REDIS_URL
        })
        await global.__redisDb__.connect()
        redisConnected = true
        console.log('Redis connection established.')
      }

      return global.__redisDb__
    },
    disconnect: async () => {
      if (global.__redisDb__) {
        await global.__redisDb__.disconnect()
        redisConnected = false
        console.log('Redis connection finished.')
      }

      return redisConnected
    }
  }
}

export { redisConnection, redisConnected }
