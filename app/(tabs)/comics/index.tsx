import Index, { Section } from '@/components/Index';
import { searchMovies } from '@/integration/tmdb';
import { getMovieStatuses, getMovieTile } from '@/util/movies';

const sections: Section[] = [];

export default function ComicsIndex() {

    return (
        // TODO: create methods for Comics
        <Index getStatuses={getMovieStatuses} buildTile={getMovieTile} searchData={searchMovies} searchOn="comics" sections={sections} />
    );

}
