import Index, { Section } from '@/components/Index';
import { searchMovies } from '@/integration/tmdb';
import { getMovieTile } from '@/util/movies';

const sections: Section[] = [];

export default function GamesIndex() {

    return (
        // TODO: create methods for Games
        <Index buildTile={getMovieTile} searchData={searchMovies} searchOn="games" sections={sections} />
    );

}
