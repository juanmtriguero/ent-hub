import { GameFilterParams } from '@/components/GameFilter';
import { Api, ApiAuth, ApiCode, getAccessToken, getCredentials, invalidCredentials } from '@/integration/main';

const BASE_URL = 'https://api.igdb.com/v4/';
const PATH_GAMES = 'games/';
const PATH_GENRES = 'genres/';
const PATH_PLATFORMS = 'platforms/';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

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

type GetBodyOptions = {
    filter?: string;
    search?: string;
    page?: number;
    sort?: string;
    limit?: number;
};

function getBody(fields: string[], { filter, search, page, sort, limit }: GetBodyOptions) {
    let body = `fields ${fields.join(', ')};`;
    if (filter?.length) {
        body += ` where ${filter};`;
    }
    if (search?.length) {
        body += ` search "${search}";`;
    }
    const limitValue = limit ?? DEFAULT_LIMIT;
    body += ` limit ${limitValue};`;
    if (page) {
        body += ` offset ${limitValue * (page - 1)};`;
    }
    if (sort?.length) {
        body += ` sort ${sort};`;
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
    const body = getBody(fields, { filter, search: params.text, page });
    const results: any[] = await get(PATH_GAMES, body, signal);
    const numPages = results.length === DEFAULT_LIMIT ? page + 1 : page;
    return { numPages, results };
}

export async function getLatestGames(page: number, params?: GameFilterParams): Promise<{ numPages: number, results: any[] }> {
    const fields = [
        'cover.image_id',
        'first_release_date',
        'name',
    ];
    let filter = `game_type = (${INCLUDED_GAME_TYPES.join(', ')}) & version_parent = null & first_release_date <= ${Math.floor(new Date().getTime() / 1000)}`;
    if (params?.platforms?.length) {
        filter += ` & platforms = (${params.platforms.join(', ')})`;
    }
    if (params?.genres?.length) {
        filter += ` & genres = [${params.genres.join(', ')}]`;
    }
    const body = getBody(fields, { filter, page, sort: 'first_release_date desc' });
    const results: any[] = await get(PATH_GAMES, body);
    const numPages = results.length === DEFAULT_LIMIT ? page + 1 : page;
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
        'game_type.type',
        'genres.name',
        'name',
        'parent_game.cover.image_id',
        'parent_game.first_release_date',
        'parent_game.name',
        'platforms.abbreviation',
        'platforms.name',
        'platforms.platform_logo.image_id',
        'platforms.versions.platform_version_release_dates.date',
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
        'url',
    ];
    const [ result ] = await get(PATH_GAMES, getBody(fields, { filter: `id = ${id}`, limit: 1 }));
    return result;
}

export async function getGameGenres(): Promise<any[]> {
    return await get(PATH_GENRES, getBody([ 'name' ], { limit: MAX_LIMIT }));
};

export async function getGamePlatforms(): Promise<any[]> {
    const fields = [
        'abbreviation',
        'name',
        'platform_logo.image_id',
        'versions.platform_version_release_dates.date',
    ];
    return await get(PATH_PLATFORMS, getBody(fields, { limit: MAX_LIMIT }));
};

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
