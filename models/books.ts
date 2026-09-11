import { Genre, SavedItem } from '@/models/interfaces';
import { Realm } from '@realm/react';
import { ExternalPathString } from 'expo-router';

export class BookGenre extends Realm.Object implements Genre {
    id!: string;
    name!: string;

    static schema: Realm.ObjectSchema = {
        name: 'BookGenre',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
        },
    };
}

export class Book extends Realm.Object implements SavedItem<BookGenre> {
    id!: string;
    status!: string;
    timestamp!: number;
    title!: string;
    releaseYear!: string;
    originalTitle!: string;
    url!: ExternalPathString;
    rating!: number;
    genres!: Realm.List<BookGenre>;
    description?: string;
    details?: string;
    posterUrl?: string;
    backdropUrl?: string;

    static schema: Realm.ObjectSchema = {
        name: 'Book',
        primaryKey: 'id',
        properties: {
            id: 'string',
            status: 'string',
            timestamp: 'int',
            title: 'string',
            releaseYear: 'string',
            originalTitle: 'string',
            url: 'string',
            rating: 'float',
            genres: 'BookGenre[]',
            description: 'string?',
            details: 'string?',
            posterUrl: 'string?',
            backdropUrl: 'string?',
        },
    };
}
