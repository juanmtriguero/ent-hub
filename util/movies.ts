import { Status } from '@/components/Screen';
import { Tile } from '@/components/TileList';
import { BACKDROP_SIZE, IMAGE_URL, LOGO_SIZE, POSTER_SIZE } from '@/integration/tmdb';
import { Genre, Item, WatchProvider } from '@/models/interfaces';
import { formatDuration, intervalToDuration } from 'date-fns';
import { es } from 'date-fns/locale';
import { Href } from 'expo-router';
import { PlatformColor } from 'react-native';

const getPosterUrl = (posterPath: string): string | undefined => posterPath ? `${IMAGE_URL}${POSTER_SIZE}${posterPath}` : undefined;
const getBackdropUrl = (backdropPath: string): string => `${IMAGE_URL}${BACKDROP_SIZE}${backdropPath}`;
const getReleaseYear = (releaseDate: string): string => new Date(releaseDate).getFullYear().toString();
const getDuration = (minutes: number): string => formatDuration(intervalToDuration({ start: 0, end: minutes * 60000 }), { locale: es });
const getMovieGenres = (genres: any[]): Genre[] => genres.map(genre => ({ id: `${genre.id}`, name: genre.name }));
const getWatchProvider = (provider: any): WatchProvider => ({
    id: `${provider.provider_id}`,
    logoUrl: `${IMAGE_URL}${LOGO_SIZE}${provider.logo_path}`,
    name: provider.provider_name,
});
const getWatchProviders = (watchProviders?: { [key: string]: any[] }): any => ({
    flatrate: watchProviders?.flatrate?.map(getWatchProvider) ?? [],
    ads: watchProviders?.ads?.map(getWatchProvider) ?? [],
    rent: watchProviders?.rent?.map(getWatchProvider) ?? [],
    buy: watchProviders?.buy?.map(getWatchProvider) ?? [],
});

export const getMovieDetail = (id: string): Href => ({
    pathname: '/movies/[movie]',
    params: { movie: id },
});

export const getMovieTile = (movie: any): Tile => ({
    detail: getMovieDetail(movie.id),
    id: `${movie.id}`,
    posterUrl: getPosterUrl(movie.poster_path),
    releaseYear: getReleaseYear(movie.release_date),
    title: movie.title,
});

export const buildMovie = (movie: any): Item => ({
    id: `${movie.id}`,
    backdropUrl: getBackdropUrl(movie.backdrop_path),
    description: movie.overview,
    details: getDuration(movie.runtime),
    genres: getMovieGenres(movie.genres),
    originalTitle: movie.original_title,
    posterUrl: getPosterUrl(movie.poster_path),
    releaseYear: getReleaseYear(movie.release_date),
    title: movie.title,
    ...getWatchProviders(movie['watch/providers'].results.ES),
});

export const movieStatusOptions: Status[] = [
    { label: 'Want to watch', value: 'pending', icon: 'bookmark', color: PlatformColor('systemOrange') },
    { label: 'Watched', value: 'watched', icon: 'checkmark', color: PlatformColor('systemGreen') },
];
