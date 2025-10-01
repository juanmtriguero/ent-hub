import TileList from '@/components/TileList';
import { getPopularMovies } from '@/integration/tmdb';
import { getMovieTile, movieStatusOptions } from '@/util/movies';

export default function MoviesPopular() {

    return (
        <TileList buildTile={getMovieTile} fetchData={getPopularMovies} statusOptions={movieStatusOptions} />
    );

}