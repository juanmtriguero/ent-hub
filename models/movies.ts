import { Genre, Item, SavedItem, SavedProvider, WatchProvider } from '@/models/interfaces';
import { Realm } from '@realm/react';

export class MovieGenre extends Realm.Object implements Genre {
    id!: string;
    name!: string;

    static schema: Realm.ObjectSchema = {
        name: 'MovieGenre',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
        },
    };
}

export class MovieProvider extends Realm.Object implements SavedProvider {
    id!: string;
    logoUrl!: string;
    mine!: boolean;
    name!: string;
    priority?: number;

    static schema: Realm.ObjectSchema = {
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

export interface MovieItem extends Item {
    flatrate: WatchProvider[];
    ads: WatchProvider[];
    rent: WatchProvider[];
    buy: WatchProvider[];
}

export class Movie extends Realm.Object implements SavedItem<MovieGenre> {
    id!: string;
    status!: string;
    timestamp!: number;
    title!: string;
    releaseYear!: string;
    originalTitle!: string;
    genres!: Realm.List<MovieGenre>;
    flatrate!: Realm.List<MovieProvider>;
    ads!: Realm.List<MovieProvider>;
    rent!: Realm.List<MovieProvider>;
    buy!: Realm.List<MovieProvider>;
    description?: string;
    details?: string;
    posterUrl?: string;
    backdropUrl?: string;

    static schema: Realm.ObjectSchema = {
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
