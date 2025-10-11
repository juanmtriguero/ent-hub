import FetchList from '@/components/FetchList';
import { getPopularMovies } from '@/integration/tmdb';
import { Movie } from '@/models/movies';
import { getMovieTile, movieStatusOptions } from '@/util/movies';

export default function MoviesPopular() {

    return (
        <FetchList schema={Movie} statusOptions={movieStatusOptions} buildTile={getMovieTile} fetchData={getPopularMovies} />
    );

}