import { Api, ApiKey, getApiKey, invalidApiKey } from '@/integration/main';

const BASE_URL = 'https://api.themoviedb.org/3/';
const PATH_AUTHENTICATE = 'authentication';
const PATH_SEARCH_MOVIE = 'search/movie';
const PATH_MOVIE_DETAILS = 'movie/';
const PATH_MOVIE_POPULAR = 'movie/popular';
const PATH_WATCH_PROVIDERS = '/watch/providers';

export const IMAGE_URL = 'https://image.tmdb.org/t/p/';
export const POSTER_SIZE = 'w342';
export const BACKDROP_SIZE = 'w780';
export const LOGO_SIZE = 'w92';

async function getHeaders(): Promise<HeadersInit> {
    return {
        Accept: 'application/json',
        Authorization: `Bearer ${await getApiKey(ApiKey.TheMovieDB)}`
    };
}

async function authenticate(): Promise<boolean> {
    const response = await fetch(`${BASE_URL}${PATH_AUTHENTICATE}`, {
        method: 'GET',
        headers: await getHeaders(),
    });
    return response.ok;
}

async function get(path: string, params?: URLSearchParams, signal?: AbortSignal): Promise<any> {
    const response = await fetch(`${BASE_URL}${path}?${params}`, {
        method: 'GET',
        headers: await getHeaders(),
        signal: signal,
    });
    if (response.ok) {
        return response.json();
    } else {
        if (response.status === 401) {
            invalidApiKey(tmdb.name);
        }
        throw new Error(`[${response.status}] ${response.statusText}`);
    }
}

export async function searchMovies(page: number, params: any, signal: AbortSignal): Promise<{ numPages: number, results: any[] }> {
    const searchParams = new URLSearchParams({
        language: 'es-ES',
        page: page.toString(),
        query: params.text,
    });
    const { results, total_pages }: { results: any[], total_pages: number } = await get(PATH_SEARCH_MOVIE, searchParams, signal);
    return { numPages: total_pages, results };
}

export async function getPopularMovies(page: number): Promise<{ numPages: number, results: any[] }> {
    const searchParams = new URLSearchParams({
        language: 'es-ES',
        page: page.toString(),
    });
    const { results, total_pages }: { results: any[], total_pages: number } = await get(PATH_MOVIE_POPULAR, searchParams);
    return { numPages: total_pages, results };
}

export async function getMovie(id: string): Promise<any> {
    const params = new URLSearchParams({
        language: 'es-ES',
    });
    return await get(PATH_MOVIE_DETAILS + id, params);
}

export async function getMovieWatchProviders(id: string): Promise<any> {
    const { results } = await get(PATH_MOVIE_DETAILS + id + PATH_WATCH_PROVIDERS);
    return results.ES;
}

export const tmdb: Api = {
    key: ApiKey.TheMovieDB,
    logo: require('@/assets/logos/tmdb.png'),
    name: 'The Movie Database',
    url: 'https://www.themoviedb.org/settings/api',
    validateKey: authenticate,
};
