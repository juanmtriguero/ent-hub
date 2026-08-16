import { ExternalPathString } from 'expo-router';

export interface Genre {
    id: string;
    name: string;
}

export interface PartialItem {
    id: string,
    title: string,
    releaseYear: string,
    posterUrl?: string,
}

export interface Item extends PartialItem {
    originalTitle: string;
    url: ExternalPathString;
    genres: Genre[];
    related: PartialItem[];
    description?: string;
    details?: string;
    backdropUrl?: string;
}

export interface SavedItem<T extends Genre> extends Omit<Item, 'genres' | 'related'> {
    status: string;
    timestamp: number;
    genres: Realm.List<T>;
}

export interface WatchProvider {
    id: string;
    logoUrl: string;
    name: string;
    priority?: number;
}

export interface SavedProvider extends WatchProvider {
    mine: boolean;
}
