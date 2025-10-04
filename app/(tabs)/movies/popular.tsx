import TileList from '@/components/TileList';
import { getPopularMovies } from '@/integration/tmdb';
import { getMovieStatuses, getMovieTile } from '@/util/movies';

export default function MoviesPopular() {

    return (
        <TileList getStatuses={getMovieStatuses} buildTile={getMovieTile} fetchData={getPopularMovies} />
    );

}