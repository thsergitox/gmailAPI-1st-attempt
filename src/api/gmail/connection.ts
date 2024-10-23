import dotenv from 'dotenv';
import { google } from 'googleapis';
import { saveNewRefreshToken } from '~/database';

dotenv.config();

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URIS) {
    throw new Error('Required environment variables are missing.');
}

const initializeOAuthClient = async () => {
    try {
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN

        if (!REFRESH_TOKEN) {
            throw new Error('No refresh token found.')
        }

        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URIS
        );

        // generate a url that asks permissions for Blogger and Google Calendar scopes
        const scopes = [
           'https://mail.google.com/'
        ];
        
        const url = oAuth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
        
            // If you only need one scope, you can pass it as a string
            scope: scopes
        });
        
        try {
           
            oAuth2Client.setCredentials({
                refresh_token: REFRESH_TOKEN,
            });
    
            oAuth2Client.on('tokens', (tokens) => {
                if (tokens.refresh_token) {
                    console.log('New refresh token received');
                    saveNewRefreshToken(tokens.refresh_token);
                }
                console.log('New access token received');
            });


            


    
           
            // Forzar una renovación de tokens
            try {
                await oAuth2Client.getAccessToken();
                console.log('Successfully refreshed access token');
            } catch (error) {
                console.error('Error refreshing access token:', error);
                if ((error as any).response && (error as any).response.data.error === 'invalid_grant') {
                    console.error('The refresh token is invalid or has been revoked. You need to re-authenticate.');
                    // Aquí podrías implementar lógica para reiniciar el proceso de autenticación
                    throw new Error('Authentication required');
                }
                throw error;
            }
    
            console.log('OAuth2 client initialized');
            return oAuth2Client;
        } catch (e) {
            console.error('Error setting credentials:', e);
            throw e;
        }


        

        

    } catch (error) {
        console.error('Error initializing OAuth2 client:', error);
        throw error;
    }
};

export default initializeOAuthClient
