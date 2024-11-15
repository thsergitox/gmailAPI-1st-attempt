import { gmail_v1, google } from 'googleapis'
import initializeOAuthClient from '~/api/gmail/connection'
import { verifySpamWithAI } from '~/api/groq'
import { addMailsToBlackList, getLastDate } from '~/database'

export const addMailSpamToBlacklist = async (): Promise<void> => {
    try {
        const authClient = await initializeOAuthClient()
        const gmail: gmail_v1.Gmail = google.gmail({ version: 'v1', auth: authClient })
        const lastDate = await getLastDate()
        console.log('xd',lastDate)
        const res = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['SENT'],
            q: `to: acecom@uni.edu.pe after:${lastDate}`,
            maxResults: 10,
        })

        const messages = res.data.messages;

        if (!messages || messages.length === 0) {
            console.log('No messages found.')
            return;
        }

        const emailSet = new Set<string>()
        // Palabras clave para detectar spam
        const keywords = new Set<string>([
            'free',
            'winner',
            'subscribe',
            'offer',
            'cheap',
            'win',
            'prize',
            '100%'
        ])
        const emails: Array<{ id: string, body: string }> = []
        for (const message of messages) {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id!,
            })

            const bodyPart = msg.data.payload?.body?.data

            
            if (bodyPart) {
                const decodedBody = Buffer.from(bodyPart, 'base64')
                    .toString('utf-8')
                    .replace(/\r?\n|\r/g, ' ')
                    .split(' ');
                const setWords = new Set<string>(decodedBody)

                emails.push({ id: msg.data.id!, body: decodedBody.join(' ') || '' })

                // Función de intersección para Sets, para saber si un correo contiene alguna de las palabras clave del diccionario
                const intersection = (set1: Set<string>, set2: Set<string>): Set<string> => {
                    return new Set([...set1].filter(item => set2.has(item)))
                }

                const containsKeyword = intersection(setWords, keywords);

                if (containsKeyword.size > 0) {
                    const emailMatch = decodedBody.join(' ').match(/- Email:\s*([^\s]+)/);
                    if (emailMatch) {
                        emailSet.add(emailMatch[1]);
                    }
                }
            } else {
                console.log('No emails were found!');
            }
        }

        // En estas dos líneas se añaden los correos spam a la blacklist que fueron clasificados como spam solo con el diccionario de palabras 
        const emailSpamsArray = Array.from(emailSet)
        addMailsToBlackList(emailSpamsArray)
        
        // En el código que está abajo se clasifican los correos spam con un modelo de lenguaje natural GROQ, pero estoy tomando en consideración a todos los correos
        const spamEmails = await verifySpamWithAI(emails)
        
        // Estos está comentado para que no se actualice la fecha de la última verificación de correos spam, así se puede probar el código sin que se actualice la fecha en la bd
        //saveLastDate()

        // Acá si deseas puedes colocar el método que añade los correos a la blacklist
        spamEmails.forEach((email) => {
            console.log(email.id, email.spam)
            if (email.spam) {
                gmail.users.messages.trash({
                    userId: 'me',
                    id: email.id,
                })
                console.log('Email moved to trash')
            }
        })

        console.log(emailSpamsArray.length)
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

