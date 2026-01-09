import { ExternalPathString } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ImageSourcePropType } from 'react-native';

const API_KEY_SUFFIX = '_API_KEY';
const CLIENT_ID_SUFFIX = '_CLIENT_ID';
const CLIENT_SECRET_SUFFIX = '_CLIENT_SECRET';
const OAUTH_TOKEN_SUFFIX = '_OAUTH_TOKEN';

export enum ApiAuth {
    ApiKey,
    OAuth2ClientCredentials,
}

export enum ApiCode {
    TheMovieDB = 'TMDB',
    InternetGameDB = 'IGDB',
    Google = 'GOOGLE',
    ComicVine = 'COMIC_VINE',
};

export type Api = {
    auth: ApiAuth;
    code: ApiCode;
    logo: ImageSourcePropType;
    name: string;
    tokenUrl?: string;
    url: ExternalPathString;
    validateCredentials: () => Promise<boolean>;
};

export async function getCredentials(api: Api): Promise<string | null> {
    switch (api.auth) {
        case ApiAuth.ApiKey:
            return await SecureStore.getItemAsync(`${api.code}${API_KEY_SUFFIX}`);
        case ApiAuth.OAuth2ClientCredentials:
            return JSON.stringify({
                clientId: await SecureStore.getItemAsync(`${api.code}${CLIENT_ID_SUFFIX}`),
                clientSecret: await SecureStore.getItemAsync(`${api.code}${CLIENT_SECRET_SUFFIX}`),
            });
    }
}

export async function setCredentials(api: Api, value: string): Promise<void> {
    switch (api.auth) {
        case ApiAuth.ApiKey:
            await SecureStore.setItemAsync(`${api.code}${API_KEY_SUFFIX}`, value);
            break;
        case ApiAuth.OAuth2ClientCredentials:
            const { clientId, clientSecret } = JSON.parse(value);
            await SecureStore.setItemAsync(`${api.code}${CLIENT_ID_SUFFIX}`, clientId);
            await SecureStore.setItemAsync(`${api.code}${CLIENT_SECRET_SUFFIX}`, clientSecret);
            await SecureStore.setItemAsync(`${api.code}${OAUTH_TOKEN_SUFFIX}`, '');
            break;
    }
}

export function invalidCredentials(api: Api): void {
    switch (api.auth) {
        case ApiAuth.ApiKey:
            alert(`The API key for ${api.name} is invalid, please update it on the settings`);
            break;
        case ApiAuth.OAuth2ClientCredentials:
            alert(`The client credentials for ${api.name} are invalid, please update them on the settings`);
            break;
    }
}

export async function getAccessToken(api: Api): Promise<string | null> {
    const value = await SecureStore.getItemAsync(`${api.code}${OAUTH_TOKEN_SUFFIX}`);
    if (value) {
        const { accessToken, expiresAt } = JSON.parse(value);
        if (expiresAt > Date.now()) {
            return accessToken;
        }
    }
    switch (api.auth) {
        case ApiAuth.OAuth2ClientCredentials:
            return await getAccessTokenClientCredentials(api);
    }
    return null;
}

async function getAccessTokenClientCredentials(api: Api): Promise<string | null> {
    const params = new URLSearchParams({
        client_id: await SecureStore.getItemAsync(`${api.code}${CLIENT_ID_SUFFIX}`) ?? '',
        client_secret: await SecureStore.getItemAsync(`${api.code}${CLIENT_SECRET_SUFFIX}`) ?? '',
        grant_type: 'client_credentials',
    });
    const response = await fetch(`${api.tokenUrl}?${params}`, { method: 'POST' });
    if (response.ok) {
        const { access_token, expires_in } = await response.json();
        await SecureStore.setItemAsync(`${api.code}${OAUTH_TOKEN_SUFFIX}`, JSON.stringify({
            accessToken: access_token,
            expiresAt: Date.now() + (expires_in * 1000),
        }));
        return access_token;
    }
    return null;
}
