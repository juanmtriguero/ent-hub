import { Status } from '@/components/Screen';
import { Tile } from '@/components/TileList';
import { POSTER_URL, POSTER_FORMAT } from '@/integration/openLibrary';
import { Genre, Item, PartialItem } from '@/models/interfaces';
import { Href } from 'expo-router';
import { PlatformColor } from 'react-native';

const getId = (key: string): string => key.replace('/works/', '');
const getFieldFromEdition = (book: any, field: string): string => {
    if (book.editions?.docs?.length) {
        const value = book.editions.docs[0][field];
        if (value) {
            return value;
        }
    }
    return book[field];
};
const getPosterUrl = (book: any): string | undefined => {
    const coverId = getFieldFromEdition(book, 'cover_i');
    if (coverId) {
        return `${POSTER_URL}${coverId}-${POSTER_FORMAT}`;
    }
    return undefined;
};
const getAuthor = (authors: []): string => authors?.length ? authors.join(', ') : 'Unknown author';

export const getBookDetail = (id: string): Href => ({
    pathname: '/books/[book]',
    params: { book: id },
});

export const getBookTile = (book: any): Tile => ({
    detail: getBookDetail(getId(book.key)),
    ...getPartialBook(book),
});

const getPartialBook = (book: any): PartialItem => ({
    id: getId(book.key),
    posterUrl: getPosterUrl(book),
    releaseYear: book.first_publish_year?.toString() ?? '????',
    title: getFieldFromEdition(book, 'title'),
});

export const buildBook = (book: any): Item => ({
    ...getPartialBook(book),
    backdropUrl: getPosterUrl(book),
    description: getFieldFromEdition(book, 'description'),
    details: getAuthor(book.author_name),
    genres: book.genres.map(getGenre),
    related: book.related.map(getPartialBook),
    originalTitle: book.title,
    url: `https://openlibrary.org${book.key}`,
    rating: book.rating * 2,
});

export const getGenre = (genre: any): Genre => ({
    id: genre.key.replace('/tags/', ''),
    name: genre.name,
});

export const bookStatusOptions: Status[] = [
    { label: 'Want to read', value: 'pending', icon: 'bookmark', color: PlatformColor('systemOrange') },
    { label: 'Reading', value: 'reading', icon: 'play', color: PlatformColor('systemBlue') },
    { label: 'Paused', value: 'paused', icon: 'pause', color: PlatformColor('systemYellow') },
    { label: 'Read', value: 'read', icon: 'checkmark', color: PlatformColor('systemGreen') },
    { label: 'Abandoned', value: 'abandoned', icon: 'xmark', color: PlatformColor('systemRed') },
];
