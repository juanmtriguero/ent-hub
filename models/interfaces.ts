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
    genres: Genre[];
    description?: string;
    details?: string;
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
