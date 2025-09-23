import { POSTER_URL } from '@/integration/tmdb';
import { Tile } from '@/components/TileList';

export const getMovieTile = (movie: any): Tile => ({
    posterUrl: POSTER_URL + movie.poster_path,
    title: movie.title,
    releaseYear: new Date(movie.release_date).getFullYear().toString(),
    detail: {
        pathname: '/movies/[movie]',
        params: { movie: movie.id },
    },
});
