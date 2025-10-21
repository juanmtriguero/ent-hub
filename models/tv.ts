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

export class TVEpisode extends Realm.Object {
    id!: string;
    name!: string;
    number!: number;
    airDate!: Date;
    watched!: boolean;
    description?: string;
    duration?: number;
    stillUrl?: string;

    static schema = {
        name: 'TVEpisode',
        embedded: true,
        properties: {
            id: 'string',
            name: 'string',
            number: 'int',
            airDate: 'date',
            watched: 'bool',
            description: 'string?',
            duration: 'int?',
            stillUrl: 'string?',
        },
    };
}

export class TVSeason extends Realm.Object {
    id!: string;
    name!: string;
    number!: number;
    airDate!: Date;
    count!: number;
    episodes!: TVEpisode[];
    description?: string;
    posterUrl?: string;

    static schema = {
        name: 'TVSeason',
        embedded: true,
        properties: {
            id: 'string',
            name: 'string',
            number: 'int',
            airDate: 'date',
            count: 'int',
            episodes: 'TVEpisode[]',
            description: 'string?',
            posterUrl: 'string?',
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
    seasons!: TVSeason[];
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
            seasons: 'TVSeason[]',
            description: 'string?',
            details: 'string?',
            posterUrl: 'string?',
            backdropUrl: 'string?',
        },
    };
}
