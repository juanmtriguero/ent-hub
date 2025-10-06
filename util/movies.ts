import { Screen, Status } from '@/components/Screen';
import { Tile } from '@/components/TileList';
import { BACKDROP_SIZE, IMAGE_URL, POSTER_SIZE } from '@/integration/tmdb';
import { formatDuration, intervalToDuration } from 'date-fns';
import { es } from 'date-fns/locale';
import * as SQLite from 'expo-sqlite';
import { PlatformColor } from 'react-native';

const getPosterUrl = (posterPath: string): string => `${IMAGE_URL}${POSTER_SIZE}${posterPath}`;
const getBackdropUrl = (backdropPath: string): string => `${IMAGE_URL}${BACKDROP_SIZE}${backdropPath}`;
const getReleaseYear = (releaseDate: string): string => new Date(releaseDate).getFullYear().toString();
const getGenres = (genres: any[]): string[] => genres.map((genre: any) => genre.name);
const getDuration = (minutes: number): string => formatDuration(intervalToDuration({ start: 0, end: minutes * 60000 }), { locale: es });

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
    backdropUrl: getBackdropUrl(movie.backdrop_path),
    description: movie.overview,
    details: getDuration(movie.runtime),
    genres: getGenres(movie.genres),
    originalTitle: movie.original_title,
    posterUrl: getPosterUrl(movie.poster_path),
    releaseYear: getReleaseYear(movie.release_date),
    title: movie.title,
});

export const movieStatusOptions: Status[] = [
    { label: 'Want to watch', value: 'pending', icon: 'bookmark', color: PlatformColor('systemOrange') },
    { label: 'Watched', value: 'watched', icon: 'checkmark', color: PlatformColor('systemGreen') },
];

const database = SQLite.openDatabaseAsync('data.db');

export async function createMovieTables(): Promise<void> {
    const db = await database;
    await db.execAsync('CREATE TABLE IF NOT EXISTS movies (id TEXT PRIMARY KEY NOT NULL, status TEXT NOT NULL)');
}

export async function getMovieStatus(id: string): Promise<string | null> {
    const db = await database;
    const result = await db.getFirstAsync<{ status: string }>('SELECT status FROM movies WHERE id = $id', { $id: id });
    return result?.status ?? null;
}

export async function updateMovieStatus(id: string, status: string | null): Promise<void> {
    const db = await database;
    if (status) {
        await db.runAsync('INSERT INTO movies(id, status) VALUES($id, $status) ON CONFLICT(id) DO UPDATE SET status = $status', { $id: id, $status: status });
    } else {
        await db.runAsync('DELETE FROM movies WHERE id = $id', { $id: id });
    }
}

export async function getMovieStatuses(ids: string[]): Promise<Map<string, Status>> {
    const db = await database;
    const placeholders = ids.map(() => '?').join(',');
    const results = await db.getAllAsync<{ id: string, status: string }>(`SELECT id, status FROM movies WHERE id IN (${placeholders})`, [ ...ids ]);
    const statuses = new Map<string, Status>();
    results.forEach(result => {
        const status = movieStatusOptions.find(option => option.value === result.status);
        if (status) {
            statuses.set(result.id, status);
        }
    });
    return statuses;
}
