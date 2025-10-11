import { MovieFilterParams } from '@/components/MovieFilter';
import { Api, ApiKey, getApiKey, invalidApiKey } from '@/integration/main';

const BASE_URL = 'https://api.themoviedb.org/3/';
const PATH_AUTHENTICATE = 'authentication';
const PATH_SEARCH_MOVIE = 'search/movie';
const PATH_DISCOVER_MOVIE = 'discover/movie';
const PATH_GENRE_MOVIE_LIST = 'genre/movie/list';
const PATH_MOVIE_DETAILS = 'movie/';
const PATH_WATCH_PROVIDERS = 'watch/providers';
const PATH_WATCH_PROVIDERS_MOVIE = '/watch/providers/movie';

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

export async function getPopularMovies(page: number, params: MovieFilterParams): Promise<{ numPages: number, results: any[] }> {
    const searchParams = new URLSearchParams({
        language: 'es-ES',
        page: page.toString(),
        sort_by: 'popularity.desc',
        watch_region: 'ES',
    });
    if (params?.types?.length) {
        searchParams.append('with_watch_monetization_types', params.types.join('|'));
    }
    if (params?.providers?.length) {
        searchParams.append('with_watch_providers', params.providers.join('|'));
    }
    if (params?.genres?.length) {
        searchParams.append('with_genres', params.genres.join(','));
    }
    const { results, total_pages }: { results: any[], total_pages: number } = await get(PATH_DISCOVER_MOVIE, searchParams);
    return { numPages: total_pages, results };
}

export async function getMovie(id: string): Promise<any> {
    const params = new URLSearchParams({
        append_to_response: PATH_WATCH_PROVIDERS,
        language: 'es-ES',
    });
    return await get(PATH_MOVIE_DETAILS + id, params);
}

export async function getGenres(): Promise<any[]> {
    const searchParams = new URLSearchParams({
        language: 'es',
    });
    const { genres }: { genres: any[] } = await get(PATH_GENRE_MOVIE_LIST, searchParams);
    return genres;
};

export async function getMovieProviders(): Promise<any[]> {
    const searchParams = new URLSearchParams({
        language: 'es-ES',
        watch_region: 'ES',
    });
    const { results }: { results: any[] } = await get(PATH_WATCH_PROVIDERS_MOVIE, searchParams);
    return results;
};

export const tmdb: Api = {
    key: ApiKey.TheMovieDB,
    logo: require('@/assets/logos/tmdb.png'),
    name: 'The Movie Database',
    url: 'https://www.themoviedb.org/settings/api',
    validateKey: authenticate,
};
