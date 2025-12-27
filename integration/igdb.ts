import { Api, ApiAuth, ApiCode, getAccessToken, getCredentials, invalidCredentials } from '@/integration/main';

const BASE_URL = 'https://api.igdb.com/v4/';
const PATH_GAMES = 'games/';

const LIMIT = 100;

export const IMAGE_URL = 'https://images.igdb.com/igdb/image/upload/';
export const IMAGE_FORMAT = '.jpg';
export const POSTER_SIZE = 't_720p';
export const BACKDROP_SIZE = 't_screenshot_huge';

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

function getBody(fields: string[], page: number, filter?: string, search?: string) {
    let body = `fields ${fields.join(',')}; limit ${LIMIT}; offset ${LIMIT * (page - 1)};`;
    if (filter?.length) {
        body += ` where ${filter};`;
    }
    if (search?.length) {
        body += ` search "${search}";`;
    }
    return body;
}

export async function searchGames(page: number, params: any, signal: AbortSignal): Promise<{ numPages: number, results: any[] }> {
    const fields = [
        'cover.image_id',
        'first_release_date',
        'name',
    ];
    // FIXME: Define which game types to include
    const filter = 'game_type = 0 & parent_game = null & version_parent = null';
    const body = getBody(fields, page, filter, params.text);
    const results: any[] = await get(PATH_GAMES, body, signal);
    const numPages = results.length === LIMIT ? page + 1 : page;
    return { numPages, results };
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
