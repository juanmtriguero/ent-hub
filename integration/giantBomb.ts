import { Api, ApiKey, getApiKey, invalidApiKey } from '@/integration/main';
import { GameFilterParams } from '@/components/GameFilter';

const BASE_URL = 'https://www.giantbomb.com/api/';
const PATH_GAMES = 'games/';
const PATH_GENRES = 'genres/';
const PATH_PLATFORMS = 'platforms/';
const PATH_GAME_DETAILS = 'game/';
const PATH_FRANCHISE_DETAILS = 'franchise/';

const LIMIT = 100;

async function get(path: string, fields: string[], additionalParams?: URLSearchParams, signal?: AbortSignal): Promise<any> {
    const params = additionalParams ?? new URLSearchParams();
    params.append('api_key', (await getApiKey(ApiKey.GiantBomb)) ?? '');
    params.append('format', 'JSON');
    params.append('field_list', fields.join(','));
    const response = await fetch(`${BASE_URL}${path}?${params}`, {
        method: 'GET',
        signal: signal,
    });
    if (response.ok) {
        const body = await response.json();
        if (body.status_code !== 1) {
            throw new Error(`[${body.status_code}] ${body.error}`);
        }
        return body;
    } else {
        if (response.status === 401) {
            invalidApiKey(giantBomb.name);
        }
        throw new Error(`[${response.status}] ${response.statusText}`);
    }
}

export async function searchGames(page: number, params: any, signal: AbortSignal): Promise<{ numPages: number, results: any[] }> {
    const fields = [
        'id',
        'expected_release_year',
        'image',
        'name',
        'original_release_date',
    ];
    const additionalParams = new URLSearchParams({
        filter: `name:${params.text}`,
        limit: LIMIT.toString(),
        offset: (LIMIT * (page - 1)).toString(),
    });
    const { results, number_of_total_results }: { results: any[], number_of_total_results: number } = await get(PATH_GAMES, fields, additionalParams, signal);
    return { numPages: Math.ceil(number_of_total_results) / LIMIT, results };
}

export async function getLatestGames(page: number, params?: GameFilterParams): Promise<{ numPages: number, results: any[] }> {
    const fields = [
        'id',
        'expected_release_year',
        'image',
        'name',
        'original_release_date',
    ];
    const additionalParams = new URLSearchParams({
        filter: `original_release_date:|${new Date().toISOString()}`,
        limit: LIMIT.toString(),
        offset: (LIMIT * (page - 1)).toString(),
        sort: 'original_release_date:desc',
    });
    if (params?.platform) {
        additionalParams.append('platforms', params.platform);
    }
    const { results, number_of_total_results }: { results: any[], number_of_total_results: number } = await get(PATH_GAMES, fields, additionalParams);
    return { numPages: Math.ceil(number_of_total_results / LIMIT), results };
}

export async function getGame(id: string): Promise<any> {
    const fields = [
        'id',
        'deck',
        'developers',
        'expected_release_year',
        'franchises',
        'genres',
        'image',
        'name',
        'original_release_date',
        'platforms',
    ];
    const { results } = await get(PATH_GAME_DETAILS + id, fields);
    return results;
}

export async function getFranchise(id: string): Promise<any> {
    const fields = [
        'id',
        'deck',
        'games',
        'image',
        'name',
    ];
    const { results } = await get(PATH_FRANCHISE_DETAILS + id, fields);
    return results;
}

export async function getGameGenres(): Promise<any[]> {
    const fields = [
        'id',
        'name',
    ];
    const { results } = await get(PATH_GENRES, fields);
    return results;
};

export async function getGamePlatforms(page: number): Promise<{ numPages: number, results: any[] }> {
    const fields = [
        'id',
        'abbreviation',
        'image',
        'name',
        'release_date',
    ];
    const additionalParams = new URLSearchParams({
        limit: LIMIT.toString(),
        offset: (LIMIT * (page - 1)).toString(),
        sort: 'release_date:desc',
    });
    const { results, number_of_total_results }: { results: any[], number_of_total_results: number } = await get(PATH_PLATFORMS, fields, additionalParams);
    return { numPages: Math.ceil(number_of_total_results / LIMIT), results };
};

async function test(): Promise<boolean> {
    const params = new URLSearchParams({
        api_key: (await getApiKey(ApiKey.GiantBomb)) ?? '',
        format: 'JSON',
        field_list: 'id',
        limit: '1',
    });
    const response = await fetch(`${BASE_URL}${PATH_GAMES}?${params}`, {
        method: 'GET',
    });
    return response.ok;
}

export const giantBomb: Api = {
    key: ApiKey.GiantBomb,
    logo: require('@/assets/logos/giant-bomb.png'),
    name: 'Giant Bomb',
    url: 'https://www.giantbomb.com/api/',
    validateKey: test,
};
