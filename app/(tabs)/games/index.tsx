import Index, { Section } from '@/components/Index';
import { searchMovies } from '@/integration/tmdb';
import { getMovieStatuses, getMovieTile } from '@/util/movies';

const sections: Section[] = [];

export default function GamesIndex() {

    return (
        // TODO: create methods for Games
        <Index getStatuses={getMovieStatuses} buildTile={getMovieTile} searchData={searchMovies} searchOn="games" sections={sections} />
    );

}
