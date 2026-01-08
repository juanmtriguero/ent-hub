import { Genre, Item, PartialItem, SavedItem } from '@/models/interfaces';
import { Realm } from '@realm/react';
import { ExternalPathString } from 'expo-router';

export class GameGenre extends Realm.Object implements Genre {
    id!: string;
    name!: string;

    static schema: Realm.ObjectSchema = {
        name: 'GameGenre',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
        },
    };
}

export interface GamePlatformItem {
    id: string;
    name: string;
    short: string;
    imageUrl?: string;
    releaseDate?: Date;
}

export class GamePlatform extends Realm.Object implements GamePlatformItem {
    id!: string;
    name!: string;
    short!: string;
    imageUrl?: string;
    releaseDate?: Date;

    static schema: Realm.ObjectSchema = {
        name: 'GamePlatform',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
            short: 'string',
            imageUrl: 'string?',
            releaseDate: 'date?',
        },
    };
}

export interface GameItem extends Item {
    platforms: GamePlatformItem[];
    parentGame?: PartialItem;
    dlcs: PartialItem[];
    expandedGames: PartialItem[];
    expansions: PartialItem[];
    ports: PartialItem[];
    remakes: PartialItem[];
    remasters: PartialItem[];
    standaloneExpansions: PartialItem[];
}

export class GamePartial extends Realm.Object implements PartialItem {
    id!: string;
    title!: string;
    releaseYear!: string;
    posterUrl?: string;

    static schema = {
        name: 'GamePartial',
        embedded: true,
        properties: {
            id: 'string',
            title: 'string',
            releaseYear: 'string',
            posterUrl: 'string?',
        },
    };
}

export class Game extends Realm.Object implements SavedItem<GameGenre> {
    id!: string;
    status!: string;
    timestamp!: number;
    title!: string;
    releaseYear!: string;
    originalTitle!: string;
    url!: ExternalPathString;
    genres!: Realm.List<GameGenre>;
    platforms!: Realm.List<GamePlatform>;
    dlcs!: Realm.List<GamePartial>;
    expandedGames!: Realm.List<GamePartial>;
    expansions!: Realm.List<GamePartial>;
    ports!: Realm.List<GamePartial>;
    remakes!: Realm.List<GamePartial>;
    remasters!: Realm.List<GamePartial>;
    standaloneExpansions!: Realm.List<GamePartial>;
    parentGame?: GamePartial;
    description?: string;
    details?: string;
    posterUrl?: string;
    backdropUrl?: string;

    static schema = {
        name: 'Game',
        primaryKey: 'id',
        properties: {
            id: 'string',
            status: 'string',
            timestamp: 'int',
            title: 'string',
            releaseYear: 'string',
            originalTitle: 'string',
            url: 'string',
            genres: 'GameGenre[]',
            platforms: 'GamePlatform[]',
            dlcs: 'GamePartial[]',
            expandedGames: 'GamePartial[]',
            expansions: 'GamePartial[]',
            ports: 'GamePartial[]',
            remakes: 'GamePartial[]',
            remasters: 'GamePartial[]',
            standaloneExpansions: 'GamePartial[]',
            parentGame: 'GamePartial?',
            description: 'string?',
            details: 'string?',
            posterUrl: 'string?',
            backdropUrl: 'string?',
        },
    };
}
