import { Status } from '@/components/Screen';
import { Tile } from '@/components/TileList';
import { BACKDROP_SIZE, IMAGE_URL, LOGO_SIZE, POSTER_SIZE } from '@/integration/tmdb';
import { Genre, Item, WatchProvider } from '@/models/interfaces';
import { TVSeason } from '@/models/tv';
import { formatDuration, intervalToDuration } from 'date-fns';
import { es } from 'date-fns/locale';
import { Href } from 'expo-router';
import { PlatformColor } from 'react-native';

const getPosterUrl = (posterPath: string): string | undefined => posterPath ? `${IMAGE_URL}${POSTER_SIZE}${posterPath}` : undefined;
const getBackdropUrl = (backdropPath: string): string | undefined => backdropPath ? `${IMAGE_URL}${BACKDROP_SIZE}${backdropPath}` : undefined;
const getReleaseYear = (releaseDate: string): string => new Date(releaseDate).getFullYear().toString();
const getDuration = (minutes: number): string => formatDuration(intervalToDuration({ start: 0, end: minutes * 60000 }), { locale: es });
const getGenres = (genres: any[]): Genre[] => genres.map(genre => ({ id: `${genre.id}`, name: genre.name }));
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

export const getTVDetail = (id: string): Href => ({
    pathname: '/tv/[tv]',
    params: { tv: id },
});

export const getMovieTile = (movie: any): Tile => ({
    detail: getMovieDetail(movie.id),
    id: `${movie.id}`,
    posterUrl: getPosterUrl(movie.poster_path),
    releaseYear: getReleaseYear(movie.release_date),
    title: movie.title,
});

export const getTVTile = (tv: any): Tile => ({
    detail: getTVDetail(tv.id),
    id: `${tv.id}`,
    posterUrl: getPosterUrl(tv.poster_path),
    releaseYear: getReleaseYear(tv.first_air_date),
    title: tv.name,
});

export const buildMovie = (movie: any): Item => ({
    id: `${movie.id}`,
    backdropUrl: getBackdropUrl(movie.backdrop_path),
    description: movie.overview,
    details: getDuration(movie.runtime),
    genres: getGenres(movie.genres),
    originalTitle: movie.original_title,
    posterUrl: getPosterUrl(movie.poster_path),
    releaseYear: getReleaseYear(movie.release_date),
    title: movie.title,
    ...getWatchProviders(movie['watch/providers'].results.ES),
});

export const buildTVEpisode = (episode: any): any => ({
    id: `${episode.id}`,
    name: episode.name,
    number: episode.episode_number,
    airDate: new Date(episode.air_date),
    description: episode.overview,
    duration: episode.runtime,
    stillUrl: getBackdropUrl(episode.still_path),
});

export const buildTVSeason = (season: any): any => ({
    id: `${season.id}`,
    name: season.name,
    number: season.season_number,
    airDate: new Date(season.air_date),
    count: season.episodes?.length ?? season.episode_count,
    episodes: season.episodes?.map(buildTVEpisode),
    description: season.overview,
    posterUrl: getPosterUrl(season.poster_path),
});

export const buildTV = (tv: any): Item => ({
    id: `${tv.id}`,
    backdropUrl: getBackdropUrl(tv.backdrop_path),
    description: tv.overview,
    details: tv.status,
    genres: getGenres(tv.genres),
    originalTitle: tv.original_name,
    posterUrl: getPosterUrl(tv.poster_path),
    releaseYear: getReleaseYear(tv.first_air_date),
    title: tv.name,
    ...{
        flatrate: getWatchProviders(tv['watch/providers'].results.ES).flatrate,
        seasons: tv.seasons.map(buildTVSeason),
    },
});

export const getMovieGenre = (genre: any): Genre => ({
    id: `${genre.id}`,
    name: genre.name,
});

export const getMovieProvider = (provider: any): WatchProvider => ({
    id: `${provider.provider_id}`,
    logoUrl: `${IMAGE_URL}${LOGO_SIZE}${provider.logo_path}`,
    name: provider.provider_name,
    priority: provider.display_priorities.ES ?? provider.display_priority,
});

export const getSeasonProgress = (season: TVSeason): number => {
    const watched = season.episodes?.filter(episode => episode.watched).length;
    if (watched && season.count && season.number) {
        return watched / season.count;
    }
    return 0;
};

export const movieStatusOptions: Status[] = [
    { label: 'Want to watch', value: 'pending', icon: 'bookmark', color: PlatformColor('systemOrange') },
    { label: 'Watched', value: 'watched', icon: 'checkmark', color: PlatformColor('systemGreen') },
];

export const tvStatusOptions: Status[] = [
    { label: 'Want to watch', value: 'pending', icon: 'bookmark', color: PlatformColor('systemOrange') },
    { label: 'Watching', value: 'watching', icon: 'play', color: PlatformColor('systemBlue') },
    { label: 'Paused', value: 'paused', icon: 'pause', color: PlatformColor('systemYellow') },
    { label: 'Watched', value: 'watched', icon: 'checkmark', color: PlatformColor('systemGreen') },
    { label: 'Abandoned', value: 'abandoned', icon: 'xmark', color: PlatformColor('systemRed') },
];
