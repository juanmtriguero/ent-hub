import Screen from '@/components/Screen';
import { getMovie } from '@/integration/tmdb';
import { getMovieScreen } from '@/util/movies';
import { useLocalSearchParams } from 'expo-router';

export default function MovieScreen() {

    const { movie } = useLocalSearchParams<{ movie: string }>();

    return (
        <Screen buildScreen={getMovieScreen} fetchData={getMovie} id={movie} />
    );

}
