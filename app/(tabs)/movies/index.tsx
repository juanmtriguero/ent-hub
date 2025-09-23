import Index, { Section } from '@/components/Index';
import { getPopularMovies, searchMovies } from '@/integration/tmdb';
import { getMovieTile } from '@/util/movies';

const sections: Section[] = [
    {
        fetchData: getPopularMovies,
        limit: 4,
        title: 'Popular Movies',
        viewAll: { pathname: '/movies/popular' },
    },
];

export default function MoviesIndex() {

    return (
        <Index buildTile={getMovieTile} searchData={searchMovies} searchOn="movies" sections={sections} />
    );

}
