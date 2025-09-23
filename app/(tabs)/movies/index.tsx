import Index from '@/components/Index';
import { Tile } from '@/components/TileList';
import { POSTER_URL, searchMovies } from '@/integration/tmdb';
import { View } from 'react-native';

export default function MoviesIndex() {

    const homeView = (
        <View />
    );

    const searchFunction = (text: string, signal: AbortSignal) => {
        // TODO: add pagination
        return searchMovies(text, 1, signal).then((results) => {
            return results.map((movie: any): Tile => ({
                posterUrl: POSTER_URL + movie.poster_path,
                title: movie.title,
                releaseYear: new Date(movie.release_date).getFullYear().toString(),
                detail: {
                    pathname: '/movies/[movie]',
                    params: { movie: movie.id },
                },
            }));
        });
    };

    return (
        <Index homeView={homeView} searchFunction={searchFunction} searchOn="movies" title="Movies" />
    );

}
