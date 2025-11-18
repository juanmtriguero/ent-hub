export interface Genre {
    id: string;
    name: string;
}

export interface Item {
    id: string;
    title: string;
    releaseYear: string;
    originalTitle: string;
    genres: Genre[];
    description?: string;
    details?: string;
    posterUrl?: string;
    backdropUrl?: string;
}

export interface SavedItem<T extends Genre> extends Omit<Item, 'genres'> {
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
