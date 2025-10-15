import Index, { FetchSection, QuerySection } from '@/components/Index';
import { getPopularMovies, searchMovies } from '@/integration/tmdb';
import { Movie } from '@/models/movies';
import { getMovieDetail, getMovieTile, movieStatusOptions } from '@/util/movies';

const sections: (FetchSection | QuerySection)[] = [
    {
        fetchData: getPopularMovies,
        limit: 4,
        title: 'Popular movies',
        viewAll: { pathname: '/movies/popular' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'pending' ],
        getDetail: getMovieDetail,
        limit: 4,
        title: 'My watchlist',
        viewAll: { pathname: '/movies/pending' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'watched' ],
        getDetail: getMovieDetail,
        limit: 4,
        title: 'Recently watched',
        viewAll: { pathname: '/movies/watched' },
    },
];

export default function MoviesIndex() {

    return (
        <Index buildTile={getMovieTile} schema={Movie} searchData={searchMovies} searchOn="movies" sections={sections} statusOptions={movieStatusOptions} />
    );

}
