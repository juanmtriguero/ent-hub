import { Status } from '@/components/Screen';
import { Tile } from '@/components/TileList';
import { BOOK_URL_PREFIX } from '@/integration/hardcover';
import { Genre, Item, PartialItem } from '@/models/interfaces';
import { Href } from 'expo-router';
import { PlatformColor } from 'react-native';

const getPosterUrl = (book: any): string | undefined => book.editions?.length ? book.editions[0].image?.url : book.image?.url;
const getAuthor = (authors: any[]): string => authors?.length ? authors.map(({ author }) => author.name).join(', ') : 'Unknown author';
const getGenres = ({ Genre }: { Genre?: any[] }): Genre[] => Genre?.map(({ tag, tagSlug }) => ({ id: tagSlug, name: tag })) ?? [];

export const getBookDetail = (id: string): Href => ({
    pathname: '/books/[book]',
    params: { book: id },
});

export const getBookTile = (book: any): Tile => ({
    detail: getBookDetail(book.id),
    ...getPartialBook(book),
});

const getPartialBook = (book: any): PartialItem => ({
    id: `${book.id}`,
    posterUrl: getPosterUrl(book),
    releaseYear: `${book.release_year ?? '????'}`,
    title: book.editions?.length ? book.editions[0].title : book.title,
});

export const buildBook = (book: any): Item => ({
    ...getPartialBook(book),
    backdropUrl: getPosterUrl(book),
    description: book.description,
    details: getAuthor(book.contributions),
    genres: getGenres(book.cached_tags),
    related: book.similar_books.map(getPartialBook),
    originalTitle: book.title,
    url: `${BOOK_URL_PREFIX}${book.slug}`,
    rating: book.rating * 2,
});

export const getGenre = (genre: any): Genre => ({
    id: genre.slug,
    name: genre.tag,
});

export const bookStatusOptions: Status[] = [
    { label: 'Want to read', value: 'pending', icon: 'bookmark', color: PlatformColor('systemOrange') },
    { label: 'Reading', value: 'reading', icon: 'play', color: PlatformColor('systemBlue') },
    { label: 'Paused', value: 'paused', icon: 'pause', color: PlatformColor('systemYellow') },
    { label: 'Read', value: 'read', icon: 'checkmark', color: PlatformColor('systemGreen') },
    { label: 'Abandoned', value: 'abandoned', icon: 'xmark', color: PlatformColor('systemRed') },
];
