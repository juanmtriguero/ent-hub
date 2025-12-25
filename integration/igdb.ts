import { Api, ApiAuth, ApiCode, getAccessToken, getCredentials, invalidCredentials } from '@/integration/main';

const BASE_URL = 'https://api.igdb.com/v4/';
const PATH_GAMES = 'games/';

async function getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
        Authorization: `Bearer ${await getAccessToken(igdb)}`,
    };
    const credentials = await getCredentials(igdb);
    if (credentials?.length) {
        const { clientId } = JSON.parse(credentials);
        headers['Client-ID'] = clientId;
    }
    return headers;
}

async function get(path: string, body: string, signal?: AbortSignal): Promise<any> {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: await getHeaders(),
        signal: signal,
        body: body,
    });
    if (response.ok) {
        return response.json();
    } else {
        if (response.status === 401) {
            invalidCredentials(igdb);
        }
        throw new Error(`[${response.status}] ${response.statusText}`);
    }
}

async function test(): Promise<boolean> {
    const response = await fetch(`${BASE_URL}${PATH_GAMES}`, {
        method: 'POST',
        headers: await getHeaders(),
        body: 'fields name; limit 1;',
    });
    return response.ok;
}

export const igdb: Api = {
    code: ApiCode.InternetGameDB,
    auth: ApiAuth.OAuth2ClientCredentials,
    logo: require('@/assets/logos/igdb.png'),
    name: 'Internet Game Database',
    tokenUrl: 'https://id.twitch.tv/oauth2/token',
    url: 'https://api-docs.igdb.com/#account-creation',
    validateCredentials: test,
};
