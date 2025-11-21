import Screen from '@/components/Screen';
import WatchProviders from '@/components/WatchProviders';
import { getMovie } from '@/integration/tmdb';
import { Movie, MovieGenre, MovieItem, MovieProvider } from '@/models/movies';
import { buildMovie, movieStatusOptions } from '@/util/moviesAndTV';
import { useLocalSearchParams } from 'expo-router';

export default function MovieScreen() {

    const { movie } = useLocalSearchParams<{ movie: string }>();

    const additionalContent = (item: MovieItem | Movie) => (
        <WatchProviders<MovieProvider> flatrate={item.flatrate} ads={item.ads} rent={item.rent} buy={item.buy} />
    );

    return (
        <Screen<MovieItem, MovieGenre, Movie> additionalContent={additionalContent} buildItem={buildMovie} fetchData={getMovie} id={movie} schema={Movie} statusOptions={movieStatusOptions} />
    );

}
