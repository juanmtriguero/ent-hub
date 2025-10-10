import Index, { Section } from '@/components/Index';
import { searchMovies } from '@/integration/tmdb';
import { Movie } from '@/schema/movies';
import { getMovieTile, movieStatusOptions } from '@/util/movies';

const sections: Section[] = [];

export default function BooksIndex() {

    return (
        // TODO: create methods for Books
        <Index buildTile={getMovieTile} schema={Movie} searchData={searchMovies} searchOn="books" sections={sections} statusOptions={movieStatusOptions} />
    );

}
