import TileList from '@/components/TileList';
import { getPopularMovies } from '@/integration/tmdb';
import { Movie } from '@/models/movies';
import { getMovieTile, movieStatusOptions } from '@/util/movies';

export default function MoviesPopular() {

    return (
        <TileList schema={Movie} statusOptions={movieStatusOptions} buildTile={getMovieTile} fetchData={getPopularMovies} />
    );

}