const BASE_URL = 'https://api.themoviedb.org/3/';
const PATH_SEARCH_MOVIE = 'search/movie';
const PATH_MOVIE_POPULAR = 'movie/popular';

export const POSTER_URL = 'https://image.tmdb.org/t/p/w342/';

async function get(path: string, params: URLSearchParams, signal?: AbortSignal): Promise<any> {
    const response = await fetch(`${BASE_URL}${path}?${params}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            // FIXME: move to DB
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`
        },
        signal: signal,
    });
    if (response.ok) {
        return response.json();
    } else {
        if (response.status === 401) {
            alert('The API key for TMDB is invalid, please update it on the settings');
        }
        throw new Error(`[${response.status}] ${response.statusText}`);
    }
}

export async function searchMovies(text: string, page: number, signal: AbortSignal): Promise<any[]> {
    const searchParams = new URLSearchParams({
        language: 'es-ES',
        page: page.toString(),
        query: text,
    });
    const { results }: { results: any[] } = await get(PATH_SEARCH_MOVIE, searchParams, signal);
    return results;
}

export async function getPopularMovies(): Promise<any[]> {
    const searchParams = new URLSearchParams({
        language: 'es-ES',
        page: '1',
    });
    const { results }: { results: any[] } = await get(PATH_MOVIE_POPULAR, searchParams);
    return results;
}
