import initializeOAuthClient from '~/api/gmail/connection'
import { google, gmail_v1 } from 'googleapis'
import { addMailsToBlackList, getLastDate, saveLastDate } from '~/database'

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
            maxResults: 500,
        })

        const messages = res.data.messages;

        if (!messages || messages.length === 0) {
            console.log('No messages found.')
            return;
        }

        const emailSet = new Set<string>()
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

                // Función de intersección para Sets
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

        const emailArray = Array.from(emailSet)

        addMailsToBlackList(emailArray)
        saveLastDate()

        console.log('Emails:', emailArray)
        console.log(emailArray.length)
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

