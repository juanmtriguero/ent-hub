import Index, { Section } from '@/components/Index';
import { searchMovies } from '@/integration/tmdb';
import { Movie } from '@/models/movies';
import { getMovieTile, movieStatusOptions } from '@/util/movies';

const sections: Section[] = [];

export default function TVIndex() {

    return (
        // TODO: create methods for TV
        <Index buildTile={getMovieTile} schema={Movie} searchData={searchMovies} searchOn="TV" sections={sections} statusOptions={movieStatusOptions} />
    );

}
