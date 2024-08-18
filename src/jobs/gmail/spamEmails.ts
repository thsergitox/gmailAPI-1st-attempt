import cron from 'node-cron'
import { addMailSpamToBlacklist } from '~/services'

cron.schedule('0 0 */14 * *', async ()  => { 

   try {
    await addMailSpamToBlacklist()
    console.log('MailSpam Job executed')
   } catch (error) {
    console.log('There was an error', error)
   }
    
})

export default cron
