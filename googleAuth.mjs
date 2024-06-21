import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS
)

console.log(process.env.CLIENT_ID)

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
})

oAuth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        console.log('New refresh token:', tokens.refresh_token);
        // FEAT: Guardar refresh_token en redis
    }
    console.log('New access token:', tokens.access_token)
})

export default oAuth2Client;
