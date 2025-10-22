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
    watched!: boolean;
    airDate?: Date;
    description?: string;
    duration?: number;
    stillUrl?: string;

    static schema = {
        name: 'TVEpisode',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
            number: 'int',
            watched: {
                type: 'bool',
                default: false,
            },
            airDate: 'date?',
            description: 'string?',
            duration: 'int?',
            stillUrl: 'string?',
            tvSeason: {
                type: 'linkingObjects',
                objectType: 'TVSeason',
                property: 'episodes',
            },
        },
    };
}

export class TVSeason extends Realm.Object {
    id!: string;
    name!: string;
    number!: number;
    count!: number;
    episodes!: TVEpisode[];
    airDate?: Date;
    description?: string;
    posterUrl?: string;

    static schema = {
        name: 'TVSeason',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
            number: 'int',
            count: 'int',
            episodes: 'TVEpisode[]',
            airDate: 'date?',
            description: 'string?',
            posterUrl: 'string?',
            tv: {
                type: 'linkingObjects',
                objectType: 'TV',
                property: 'seasons',
            },
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
