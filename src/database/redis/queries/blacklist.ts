import { redisConnection } from '~/database'

const getBlackList = async () => {
  const redisClient = await redisConnection().connect()
  const blacklist = await redisClient.LRANGE('blacklist', 0, -1)

  return blacklist
}

const addMailsToBlackList = async (emails: string[]) => {
  const redisClient = await redisConnection().connect()
  const { length: previousBlackListLength } = await getBlackList()

  emails.forEach( async email => await redisClient.LPUSH('blacklist', email))

  const { length: laterBlackListLength } = await getBlackList()

  return laterBlackListLength > previousBlackListLength
}

export { getBlackList, addMailsToBlackList }
