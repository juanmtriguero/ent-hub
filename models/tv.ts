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
    mine!: boolean;
    name!: string;
    priority?: number;

    static schema = {
        name: 'TVProvider',
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
            parent: {
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
    episodes!: Realm.List<TVEpisode>;
    airDate?: Date;
    description?: string;
    posterUrl?: string;

    static schema: Realm.ObjectSchema = {
        name: 'TVSeason',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
            number: 'int',
            count: 'int',
            episodes: {
                type: 'list',
                objectType: 'TVEpisode',
            },
            airDate: 'date?',
            description: 'string?',
            posterUrl: 'string?',
            parent: {
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
    seasons!: Realm.List<TVSeason>;
    description?: string;
    details?: string;
    posterUrl?: string;
    backdropUrl?: string;

    static schema: Realm.ObjectSchema = {
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
            seasons: {
                type: 'list',
                objectType: 'TVSeason',
            },
            description: 'string?',
            details: 'string?',
            posterUrl: 'string?',
            backdropUrl: 'string?',
        },
    };
}
