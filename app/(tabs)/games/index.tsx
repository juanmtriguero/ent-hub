import Index, { Section } from '@/components/Index';
import { searchMovies } from '@/integration/tmdb';
import { Movie } from '@/schema/movies';
import { getMovieTile, movieStatusOptions } from '@/util/movies';

const sections: Section[] = [];

export default function GamesIndex() {

    return (
        // TODO: create methods for Games
        <Index buildTile={getMovieTile} schema={Movie} searchData={searchMovies} searchOn="games" sections={sections} statusOptions={movieStatusOptions} />
    );

}
