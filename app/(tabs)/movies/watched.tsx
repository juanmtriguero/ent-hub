import QueryList from '@/components/QueryList';
import { Movie } from '@/models/movies';
import { getMovieDetail, movieStatusOptions } from '@/util/movies';

export default function MoviesWatched() {

    return (
        <QueryList schema={Movie} statusOptions={movieStatusOptions} query="status == $0" queryParams={['watched']} getDetail={getMovieDetail} />
    );

}