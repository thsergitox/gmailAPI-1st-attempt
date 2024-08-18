import { redisConnection } from '~/database'

const getRefreshToken = async () => {
    const redisClient = await redisConnection().connect()
    const refresh_token = await redisClient.LINDEX('refresh_token', 0)
  
    return refresh_token
}

const saveNewRefreshToken = async (refresh_token: string) => {
  const redisClient = await redisConnection().connect()  

  await redisClient.DEL('refres_token');

  await redisClient.LPUSH('refresh_token', refresh_token) 

}

export { saveNewRefreshToken, getRefreshToken }
