import Index, { Section } from '@/components/Index';
import { searchMovies } from '@/integration/tmdb';
import { getMovieStatuses, getMovieTile } from '@/util/movies';

const sections: Section[] = [];

export default function TVIndex() {

    return (
        // TODO: create methods for TV
        <Index getStatuses={getMovieStatuses} buildTile={getMovieTile} searchData={searchMovies} searchOn="TV" sections={sections} />
    );

}
