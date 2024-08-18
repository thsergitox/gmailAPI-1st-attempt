import cron from 'node-cron'
import { addMailSpamToBlacklist } from '~/services'

cron.schedule('*/30 * * * * *', () => { 
    addMailSpamToBlacklist()
    console.log('MailSpam Job executed')
})

export default cron
