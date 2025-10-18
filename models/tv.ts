import { Genre, SavedItem, WatchProvider } from '@/models/interfaces';
import { Realm } from '@realm/react';

export class TVGenre extends Realm.Object implements Genre {
    id!: string;
    name!: string;

    static schema = {
        name: 'TVGenre',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
        },
    };
}

export class TVProvider extends Realm.Object implements WatchProvider {
    id!: string;
    logoUrl!: string;
    name!: string;
    priority?: number;

    static schema = {
        name: 'TVProvider',
        primaryKey: 'id',
        properties: {
            id: 'string',
            logoUrl: 'string',
            name: 'string',
            priority: 'int?',
        },
    };
}

export class TV extends Realm.Object implements SavedItem {
    id!: string;
    status!: string;
    timestamp!: number;
    title!: string;
    releaseYear!: string;
    originalTitle!: string;
    genres!: TVGenre[];
    flatrate!: TVProvider[];
    description?: string;
    details?: string;
    posterUrl?: string;
    backdropUrl?: string;

    static schema = {
        name: 'TV',
        primaryKey: 'id',
        properties: {
            id: 'string',
            status: 'string',
            timestamp: 'int',
            title: 'string',
            releaseYear: 'string',
            originalTitle: 'string',
            genres: 'TVGenre[]',
            flatrate: 'TVProvider[]',
            description: 'string?',
            details: 'string?',
            posterUrl: 'string?',
            backdropUrl: 'string?',
        },
    };
}
