import { Genre, SavedItem, WatchProvider } from '@/models/interfaces';
import { Realm } from '@realm/react';

export class MovieGenre extends Realm.Object implements Genre {
    id!: string;
    name!: string;

    static schema = {
        name: 'MovieGenre',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
        },
    };
}

export class MovieProvider extends Realm.Object implements WatchProvider {
    id!: string;
    logoUrl!: string;
    mine!: boolean;
    name!: string;
    priority?: number;

    static schema = {
        name: 'MovieProvider',
        primaryKey: 'id',
        properties: {
            id: 'string',
            logoUrl: 'string',
            mine: {
                type: 'bool',
                default: false,
            },
            name: 'string',
            priority: 'int?',
        },
    };
}

export class Movie extends Realm.Object implements SavedItem {
    id!: string;
    status!: string;
    timestamp!: number;
    title!: string;
    releaseYear!: string;
    originalTitle!: string;
    genres!: MovieGenre[];
    flatrate!: MovieProvider[];
    ads!: MovieProvider[];
    rent!: MovieProvider[];
    buy!: MovieProvider[];
    description?: string;
    details?: string;
    posterUrl?: string;
    backdropUrl?: string;

    static schema = {
        name: 'Movie',
        primaryKey: 'id',
        properties: {
            id: 'string',
            status: 'string',
            timestamp: 'int',
            title: 'string',
            releaseYear: 'string',
            originalTitle: 'string',
            genres: 'MovieGenre[]',
            flatrate: 'MovieProvider[]',
            ads: 'MovieProvider[]',
            rent: 'MovieProvider[]',
            buy: 'MovieProvider[]',
            description: 'string?',
            details: 'string?',
            posterUrl: 'string?',
            backdropUrl: 'string?',
        },
    };
}
