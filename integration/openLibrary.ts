import { BookFilterParams } from '@/components/BookFilter';
import { Api, ApiAuth, ApiCode } from '@/integration/main';

const BASE_URL = 'https://openlibrary.org/';
const PATH_SEARCH_BOOK = 'search';
const PATH_BOOK_DETAILS = 'works/';
const PATH_BOOK_RATINGS = '/ratings';
const SUFFIX = '.json';

export const POSTER_URL = 'https://covers.openlibrary.org/b/id/';
export const POSTER_FORMAT = 'L.jpg';

const LIMIT = 100;

async function get(path: string, params?: URLSearchParams, signal?: AbortSignal): Promise<any> {
    const response = await fetch(`${BASE_URL}${path}${SUFFIX}?${params}`, {
        method: 'GET',
        signal: signal,
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(`[${response.status}] ${response.statusText}`);
    }
}

export async function searchBooks(page: number, params: any, signal: AbortSignal): Promise<{ numPages: number, results: any[] }> {
    const fields = [
        'cover_i',
        'editions',
        'first_publish_year',
        'key',
        'title',
    ];
    const searchParams = new URLSearchParams({
        q: params.text,
        fields: fields.join(','),
        page: page.toString(),
        limit: LIMIT.toString(),
        lang: 'es',
    });
    const { docs, numFound }: { docs: any[], numFound: number } = await get(PATH_SEARCH_BOOK, searchParams, signal);
    return { numPages: Math.ceil(numFound / LIMIT), results: docs };
}

export async function getPopularBooks(page: number, params: BookFilterParams): Promise<{ numPages: number, results: any[] }> {
    let query = 'language:spa';
    if (params?.genres?.length) {
        const genres = (await getBookGenres()).filter((genre: any) => params.genres?.includes(genre.key.replace('/tags/', '')));
        if (genres.length) {
            query += ` subject:("${genres.map((genre: any) => genre.name).join('" AND "')}")`;
        }
    }
    const fields = [
        'cover_i',
        'editions',
        'first_publish_year',
        'key',
        'title',
    ];
    const searchParams = new URLSearchParams({
        q: query,
        fields: fields.join(','),
        sort: 'trending',
        page: page.toString(),
        limit: LIMIT.toString(),
        lang: 'es',
    });
    const { docs, numFound }: { docs: any[], numFound: number } = await get(PATH_SEARCH_BOOK, searchParams);
    return { numPages: Math.ceil(numFound / LIMIT), results: docs };
}

export async function getBook(id: string): Promise<any> {
    const fields = [
        'author_name',
        'cover_i',
        'description',
        'editions',
        'first_publish_year',
        'key',
        'subject',
        'title',
    ];
    const searchParams = new URLSearchParams({
        q: `key:/works/${id}`,
        fields: fields.join(','),
        lang: 'es',
    });
    const searchResult = (await get(PATH_SEARCH_BOOK, searchParams)).docs[0];
    const detail = await get(PATH_BOOK_DETAILS + id);
    const ratings = await get(PATH_BOOK_DETAILS + id + PATH_BOOK_RATINGS);
    const genres = (await getBookGenres()).filter((genre: any) => detail.genres?.includes(genre.key));
    const relatedParams = new URLSearchParams({
        q: `-key:/works/${id} subject:("${searchResult.subject?.join('" OR "') ?? ''}") language:spa`,
        fields: fields.join(','),
        limit: '20',
        lang: 'es',
    });
    const related = (await get(PATH_SEARCH_BOOK, relatedParams)).docs;
    return {
        ...searchResult,
        genres,
        rating: ratings.summary.average,
        related,
    };
}

export async function getBookGenres(): Promise<any[]> {
    // FIXME: Call the API when it is supported
    return Promise.resolve([
        { key: '/tags/OL162T', name: 'Absurd' },
        { key: '/tags/OL163T', name: 'Action' },
        { key: '/tags/OL164T', name: 'Adventure' },
        { key: '/tags/OL165T', name: 'Comedy' },
        { key: '/tags/OL166T', name: 'Crime' },
        { key: '/tags/OL167T', name: 'Drama' },
        { key: '/tags/OL168T', name: 'Erotica' },
        { key: '/tags/OL169T', name: 'Fantasy' },
        { key: '/tags/OL170T', name: 'Historical' },
        { key: '/tags/OL171T', name: 'Horror' },
        { key: '/tags/OL172T', name: 'Humor' },
        { key: '/tags/OL173T', name: 'LGBTQ+' },
        { key: '/tags/OL174T', name: 'Literary' },
        { key: '/tags/OL175T', name: 'Mystery' },
        { key: '/tags/OL176T', name: 'Mythology' },
        { key: '/tags/OL177T', name: 'Romance' },
        { key: '/tags/OL178T', name: 'Satire' },
        { key: '/tags/OL179T', name: 'Sci-Fi' },
        { key: '/tags/OL180T', name: 'Thriller' },
        { key: '/tags/OL181T', name: 'Tragedy' },
        { key: '/tags/OL182T', name: 'Western' },
    ]);
};

export const openLibrary: Api = {
    code: ApiCode.OpenLibrary,
    auth: ApiAuth.None,
    logo: require('@/assets/logos/open-library.png'),
    name: 'Open Library',
    url: 'https://openlibrary.org/developers/api',
    validateCredentials: () => Promise.resolve(true),
};
