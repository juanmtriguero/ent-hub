import MovieFilter, { buildMovieQuery } from '@/components/MovieFilter';
import StatusPage from '@/components/StatusPage';
import { Movie, MovieGenre } from '@/models/movies';
import { getMovieDetail, movieStatusOptions } from '@/util/moviesAndTV';

export default function MoviesWatched() {

    return (
        <StatusPage<MovieGenre, Movie> buildQuery={buildMovieQuery} FilterComponent={MovieFilter} getDetail={getMovieDetail} schema={Movie} status="watched" statusOptions={movieStatusOptions} />
    );

}
