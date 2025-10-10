import Index, { Section } from '@/components/Index';
import { searchMovies } from '@/integration/tmdb';
import { Movie } from '@/schema/movies';
import { getMovieTile, movieStatusOptions } from '@/util/movies';

const sections: Section[] = [];

export default function ComicsIndex() {

    return (
        // TODO: create methods for Comics
        <Index buildTile={getMovieTile} schema={Movie} searchData={searchMovies} searchOn="comics" sections={sections} statusOptions={movieStatusOptions} />
    );

}
