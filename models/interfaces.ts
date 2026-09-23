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

export interface SeriesItem {
    position: number;
    item: PartialItem;
}

export interface Series {
    id: string;
    name: string;
    items: SeriesItem[];
}

export interface Item extends PartialItem {
    originalTitle: string;
    url: ExternalPathString;
    rating: number;
    genres: Genre[];
    related: PartialItem[];
    description?: string;
    details?: string;
    backdropUrl?: string;
    series?: Series;
}

export interface SavedItem<T extends Genre> extends Omit<Item, 'genres' | 'related' | 'series'> {
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
