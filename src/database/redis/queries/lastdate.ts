import { redisConnection } from '~/database'

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

const saveLastDate = async () => {
  const redisClient = await redisConnection().connect()

  await redisClient.DEL('lastdate');

  await redisClient.LPUSH('lastdate', getCurrentDate()) 

}

const getLastDate = async () => {
  const redisClient = await redisConnection().connect()

  const lastdate = await redisClient.LINDEX('lastdate', 0)

  if (!lastdate){
    const randomDay = '2010/01/01'
    return randomDay 
}
   
  
  return lastdate
}


export { getLastDate, saveLastDate }
