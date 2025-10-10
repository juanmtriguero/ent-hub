import { Screen, Status } from '@/components/Screen';
import { Tile } from '@/components/TileList';
import { BACKDROP_SIZE, IMAGE_URL, LOGO_SIZE, POSTER_SIZE } from '@/integration/tmdb';
import { formatDuration, intervalToDuration } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlatformColor } from 'react-native';

export type WatchProvider = {
    id: string;
    logoUrl: string;
    name: string;
};

export type WatchProviders = {
    flatrate?: WatchProvider[];
    ads?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
};

const getPosterUrl = (posterPath: string): string => `${IMAGE_URL}${POSTER_SIZE}${posterPath}`;
const getBackdropUrl = (backdropPath: string): string => `${IMAGE_URL}${BACKDROP_SIZE}${backdropPath}`;
const getReleaseYear = (releaseDate: string): string => new Date(releaseDate).getFullYear().toString();
const getDuration = (minutes: number): string => formatDuration(intervalToDuration({ start: 0, end: minutes * 60000 }), { locale: es });
const getWatchProviders = (watchProviders: { [key: string]: any[] }): WatchProviders => {
    const result: WatchProviders = {};
    if (watchProviders) {
        Object.entries(watchProviders).forEach(([key, value]) => {
            if ([ 'flatrate', 'ads', 'rent', 'buy' ].includes(key)) {
                result[key as keyof WatchProviders] = value.map((provider: any) => ({
                    id: provider.provider_id,
                    logoUrl: `${IMAGE_URL}${LOGO_SIZE}${provider.logo_path}`,
                    name: provider.provider_name,
                }));
            }
        });
    }
    return result;
};

export const getMovieTile = (movie: any): Tile => ({
    detail: {
        pathname: '/movies/[movie]',
        params: { movie: movie.id },
    },
    id: `${movie.id}`,
    posterUrl: getPosterUrl(movie.poster_path),
    releaseYear: getReleaseYear(movie.release_date),
    title: movie.title,
});

export const getMovieScreen = (movie: any): Screen => ({
    additionalInfo: {
        watchProviders: getWatchProviders(movie['watch/providers'].results.ES),
    },
    backdropUrl: getBackdropUrl(movie.backdrop_path),
    description: movie.overview,
    details: getDuration(movie.runtime),
    genres: movie.genres,
    originalTitle: movie.original_title,
    posterUrl: getPosterUrl(movie.poster_path),
    releaseYear: getReleaseYear(movie.release_date),
    title: movie.title,
});

export const movieStatusOptions: Status[] = [
    { label: 'Want to watch', value: 'pending', icon: 'bookmark', color: PlatformColor('systemOrange') },
    { label: 'Watched', value: 'watched', icon: 'checkmark', color: PlatformColor('systemGreen') },
];
