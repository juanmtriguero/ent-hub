import Index, { Section } from '@/components/Index';
import { Tile } from '@/components/TileList';
import { POSTER_URL, getPopularMovies, searchMovies } from '@/integration/tmdb';
import { useEffect, useState } from 'react';

export default function MoviesIndex() {

    const [ sections, setSections ] = useState<Section[]>([]);

    useEffect(() => {
        Promise.allSettled([
            getPopularMovies(),
            // TODO: more sections
        ])
        .then(results => {
            const sections: Section[] = [];
            if (results[0].status === 'fulfilled') {
                sections.push({
                    tiles: results[0].value.slice(0, 4).map(movie => getMovieTile(movie)),
                    title: 'Popular Movies',
                    // FIXME: create screen - generic?
                    viewAll: { pathname: '/movies/popular' },
                });
            }
            setSections(sections);
        });
    }, []);

    const searchFunction = (text: string, signal: AbortSignal) => {
        // TODO: add pagination
        return searchMovies(text, 1, signal).then((movies: any[]) => {
            return movies.map(movie => getMovieTile(movie));
        });
    };

    return (
        <Index searchFunction={searchFunction} searchOn="movies" sections={sections} title="Movies" />
    );

}

const getMovieTile = (movie: any): Tile => ({
    posterUrl: POSTER_URL + movie.poster_path,
    title: movie.title,
    releaseYear: new Date(movie.release_date).getFullYear().toString(),
    detail: {
        pathname: '/movies/[movie]',
        params: { movie: movie.id },
    },
});
