import { BookFilterParams } from '@/components/BookFilter';
import { Api, ApiAuth, ApiCode, getCredentials, invalidCredentials } from '@/integration/main';

const API_URL = 'https://api.hardcover.app/v1/graphql';

const PARTIAL_BOOK_FIELDS = `
    id
    title
    release_year
    image { url }
    editions(
        where: {
            language: { code2: { _eq: "es" } }
            compilation: { _eq: false }
            state: { _eq: "normalized" }
            reading_format_id: { _eq: 1 }
        }
        order_by: { users_count: desc }
        limit: 1
    ) {
        title
        image { url }
    }
`;
const FULL_BOOK_FIELDS = `
    description
    header_image_id
    rating
    slug
    contributions(where: {
        contribution: { _eq: "Author" }
    }) {
        author { name }
    }
    cached_tags
    cached_similar_book_ids
    canonical_id
    featured_book_series {
        series {
            id
            name
            book_series(
                where: {
                    book: {
                        canonical_id: { _is_null: true }
                        is_partial_book: { _eq: false }
                    }
                    compilation: { _eq: false }
                }
                distinct_on: position
                order_by: [
                    { position: asc }
                    { book: { users_count: desc } }
                ]
            ) {
                position
                book { ${PARTIAL_BOOK_FIELDS} }
            }
        }
    }
`;

const LIMIT = 100;

export const BOOK_URL_PREFIX = 'https://hardcover.app/books/';

async function getHeaders(): Promise<HeadersInit> {
    return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${await getCredentials(hardcover)}`
    };
}

async function get(body: string, signal?: AbortSignal): Promise<any> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ query: body }),
        signal: signal,
    });
    if (response.ok) {
        const { data }: { data: any } = await response.json();
        return data;
    } else {
        const { error, scope }: { error: string, scope?: string } = await response.json();
        if (response.status === 401) {
            invalidCredentials(hardcover);
        } else if (response.status === 403 && error === 'insufficient_scope') {
            alert(`The API key is missing the required scope: ${scope}`);
        } else if (response.status === 429) {
            alert('You have reached the API key daily limit, please try again tomorrow');
        }
        throw new Error(`[${response.status}] ${error}`);
    }
}

async function getBooks(ids: number[]): Promise<any[]> {
    const body = `{
        books(where: {
            id: { _in: ${JSON.stringify(ids)} }
        }) {
            ${PARTIAL_BOOK_FIELDS}
        }
    }`;
    const { books }: { books: any[] } = await get(body);
    books.sort((a, b) => ids.indexOf(a) - ids.indexOf(b));
    return books;
}

export async function searchBooks(page: number, params: any, signal: AbortSignal): Promise<{ numPages: number, results: any[] }> {
    const body = `{
        search(
            query: "${params.text}"
            query_type: "Book"
            per_page: ${LIMIT}
            page: ${page}
        ) {
            ids
        }
    }`;
    const { search: { ids } }: { search: { ids: number[] } } = await get(body, signal);
    return { numPages: ids.length === LIMIT ? page + 1 : page, results: await getBooks(ids) };
}

export async function getPopularBooks(page: number, params: BookFilterParams): Promise<{ numPages: number, results: any[] }> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    const genres = params?.genres?.length ? `taggings: {
        tag: {
            tag_category_id: { _eq: 1 }
            slug: { _in: ${JSON.stringify(params.genres)} }
        }
    }` : '';
    const body = `{
        books(
            where: {
                release_date: {
                    _gte: "${startDate.toISOString().split('T')[0]}"
                    _lte: "${endDate.toISOString().split('T')[0]}"
                }
                ${genres}
            }
            order_by: { users_count: desc }
            limit: ${LIMIT}
            offset: ${LIMIT * (page - 1)}
        ) {
            ${PARTIAL_BOOK_FIELDS}
        }
    }`;
    const { books }: { books: any[] } = await get(body);
    const numPages = books.length === LIMIT ? page + 1 : page;
    return { numPages, results: books };
}

export async function getBook(id: string): Promise<any> {
    const body = `{
        books(where: {
            id: { _eq: ${id} }
        }) {
            ${PARTIAL_BOOK_FIELDS}
            ${FULL_BOOK_FIELDS}
        }
    }`;
    const { books }: { books: any[] } = await get(body);
    const { cached_similar_book_ids, ...book } = books[0];
    return { ...book, similar_books: await getBooks(cached_similar_book_ids) };
}

export async function getBookGenres(): Promise<any[]> {
    const body = `{
        tags(
            where: {
                tag_category_id: { _eq: 1 }
            }
            order_by: { count: desc }
        ) {
            slug
            tag
        }
    }`;
    const { tags }: { tags: any[] } = await get(body);
    return tags;
};

async function test(): Promise<boolean> {
    const body = `{
        books(limit: 1) {
            id
        }
    }`;
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ query: body }),
    });
    return response.ok;
}

export const hardcover: Api = {
    code: ApiCode.Hardcover,
    auth: ApiAuth.ApiKey,
    logo: require('@/assets/logos/hardcover.png'),
    name: 'Hardcover',
    url: 'https://docs.hardcover.app/api/getting-started/',
    validateCredentials: test,
};
