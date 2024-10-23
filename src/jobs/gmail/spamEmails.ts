import cron from 'node-cron'
import { addMailSpamToBlacklist } from '~/services'

// Ejecutar el job inmediatamente al inicio
(async () => {
   try {
      await addMailSpamToBlacklist()
      console.log('MailSpam Job executed at startup')
   } catch (error) {
      console.log('There was an error at startup', error)
   }
})()

// Programar el job para que se ejecute cada 14 días
cron.schedule('0 0 */14 * *', async ()  => { 
   try {
      await addMailSpamToBlacklist()
      console.log('MailSpam Job executed')
   } catch (error) {
      console.log('There was an error', error)
   }
})

export default cron
