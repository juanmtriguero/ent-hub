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

export interface SavedItem extends Item {
    status: string;
    timestamp: number;
}

export interface WatchProvider {
    id: string;
    logoUrl: string;
    name: string;
    priority?: number;
}
