import { Api, ApiAuth, ApiCode, getAccessToken, getCredentials, invalidCredentials } from '@/integration/main';

const BASE_URL = 'https://api.igdb.com/v4/';
const PATH_GAMES = 'games/';

const LIMIT = 100;

export const IMAGE_URL = 'https://images.igdb.com/igdb/image/upload/';
export const IMAGE_FORMAT = '.jpg';
export const LOGO_FORMAT = '.png';
export const POSTER_SIZE = 't_720p';
export const BACKDROP_SIZE = 't_screenshot_huge';
export const LOGO_SIZE = 't_logo_med'

enum GameType {
    MainGame,
    DLC,
    Expansion,
    Bundle,
    StandaloneExpansion,
    Mod,
    Episode,
    Season,
    Remake,
    Remaster,
    ExpandedGame,
    Port,
    Fork,
    PackOrAddon,
    Update,
}

const INCLUDED_GAME_TYPES = [
    GameType.MainGame,
    GameType.DLC,
    GameType.Expansion,
    GameType.StandaloneExpansion,
    GameType.Remake,
    GameType.Remaster,
    GameType.ExpandedGame,
    GameType.Port,
];

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

function getBody(fields: string[], filter?: string, search?: string, page?: number) {
    let body = `fields ${fields.join(', ')};`;
    if (filter?.length) {
        body += ` where ${filter};`;
    }
    if (search?.length) {
        body += ` search "${search}";`;
    }
    if (page) {
        body += ` limit ${LIMIT}; offset ${LIMIT * (page - 1)};`;
    } else {
        body += ' limit 1;';
    }
    return body;
}

export async function searchGames(page: number, params: any, signal: AbortSignal): Promise<{ numPages: number, results: any[] }> {
    const fields = [
        'cover.image_id',
        'first_release_date',
        'name',
    ];
    const filter = `game_type = (${INCLUDED_GAME_TYPES.join(', ')}) & version_parent = null`;
    const body = getBody(fields, filter, params.text, page);
    const results: any[] = await get(PATH_GAMES, body, signal);
    const numPages = results.length === LIMIT ? page + 1 : page;
    return { numPages, results };
}

export async function getGame(id: string): Promise<any> {
    const fields = [
        'cover.image_id',
        'dlcs.cover.image_id',
        'dlcs.first_release_date',
        'dlcs.name',
        'expanded_games.cover.image_id',
        'expanded_games.first_release_date',
        'expanded_games.name',
        'expansions.cover.image_id',
        'expansions.first_release_date',
        'expansions.name',
        'first_release_date',
        'franchises',
        'game_type.type',
        'genres.name',
        'name',
        'parent_game.cover.image_id',
        'parent_game.first_release_date',
        'parent_game.name',
        'platforms.abbreviation',
        'platforms.name',
        'platforms.platform_logo.image_id',
        'ports.cover.image_id',
        'ports.first_release_date',
        'ports.name',
        'remakes.cover.image_id',
        'remakes.first_release_date',
        'remakes.name',
        'remasters.cover.image_id',
        'remasters.first_release_date',
        'remasters.name',
        'standalone_expansions.cover.image_id',
        'standalone_expansions.first_release_date',
        'standalone_expansions.name',
        'summary',
    ];
    const [ result ] = await get(PATH_GAMES, getBody(fields, `id = ${id}`));
    return result;
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
