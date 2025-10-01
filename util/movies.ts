import { Tile } from '@/components/TileList';
import { Screen } from '@/components/Screen';
import { BACKDROP_SIZE, IMAGE_URL, POSTER_SIZE } from '@/integration/tmdb';

const getPosterUrl = (posterPath: string): string => `${IMAGE_URL}${POSTER_SIZE}${posterPath}`;
const getBackdropUrl = (backdropPath: string): string => `${IMAGE_URL}${BACKDROP_SIZE}${backdropPath}`;
const getReleaseYear = (releaseDate: string): string => new Date(releaseDate).getFullYear().toString();
const getGenres = (genres: any[]): string[] => genres.map((genre: any) => genre.name);

export const getMovieTile = (movie: any): Tile => ({
    detail: {
        pathname: '/movies/[movie]',
        params: { movie: movie.id },
    },
    posterUrl: getPosterUrl(movie.poster_path),
    releaseYear: getReleaseYear(movie.release_date),
    title: movie.title,
});

export const getMovieScreen = (movie: any): Screen => ({
    backdropUrl: getBackdropUrl(movie.backdrop_path),
    description: movie.overview,
    genres: getGenres(movie.genres),
    originalTitle: movie.original_title,
    posterUrl: getPosterUrl(movie.poster_path),
    releaseYear: getReleaseYear(movie.release_date),
    title: movie.title,
});
