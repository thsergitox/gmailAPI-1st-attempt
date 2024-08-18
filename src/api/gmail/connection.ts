import { google } from 'googleapis'
import { getRefreshToken, saveNewRefreshToken } from '~/database'
import dotenv from 'dotenv'

dotenv.config();

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URIS) {
    throw new Error('Required environment variables are missing.');
}

const initializeOAuthClient = async () => {
    try {
        const REFRESH_TOKEN = await getRefreshToken()

        if (!REFRESH_TOKEN) {
            throw new Error('No refresh token found.')
        }

        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URIS
        );

        oAuth2Client.setCredentials({
            refresh_token: REFRESH_TOKEN,
        });

        oAuth2Client.on('tokens', (tokens) => {
            if (tokens.refresh_token) {
                console.log('New refresh token')
                saveNewRefreshToken(tokens.refresh_token)
            }
            console.log('New access token:', tokens.access_token)
        });

        return oAuth2Client;

    } catch (error) {
        console.error('Error initializing OAuth2 client:', error);
        throw error;
    }
};

export default initializeOAuthClient
