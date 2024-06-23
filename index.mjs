import oAuth2Client from './googleAuth.mjs'
import { google } from 'googleapis'

export const listMessagesFrom = async () => {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const res = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['SENT'],
            q: 'to: acecom@uni.edu.pe',
            maxResults: 500,
        })

        const messages = res.data.messages

        if (!messages || messages.length === 0) {
            console.log('No messages found.')
            return
        }

        const emailSet = new Set();
        // Cambiar keywords a set ✅ 
        const keywords = new Set([
            'free',
            'winner',
            'subscribe',
            'offer',
            'cheap',
            'win',
            'prize',
            '100%'
        ])

        // SOLVE: Trabajar con sets✅ 

        for (const message of messages) {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id
            });

            const bodyPart = msg.data.payload.body.data

            if (bodyPart) {
                const decodedBody = Buffer.from(bodyPart, 'base64').toString('utf-8').replace(/\r?\n|\r/g, ' ').split(' ')
                const setWords = new Set(decodedBody)

                const containsKeyword = setWords.intersection(keywords)

                if (containsKeyword.size) {
                    // VER COMO EXTRAEAR EL MAIL DE UN SET, sino lo dejo así noma
                    const emailMatch = decodedBody.match(/- Email:\s*([^\s]+)/)
                    if (emailMatch) {
                        emailSet.add(emailMatch[1]);
                    }
                }
            } else {
                console.log('Non emails were found!')
            }
        }
        // Ver como solucionar estos problemas ✅ 
        const emailArray = Array.from(emailSet)
        console.log('Emails:', emailArray)
        console.log(emailArray.length)
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
};

listMessagesFrom();
