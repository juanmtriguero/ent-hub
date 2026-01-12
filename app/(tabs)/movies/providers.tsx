import MyWatchProviders from '@/components/MyWatchProviders';
import { getMovieProviders } from '@/integration/tmdb';
import { MovieProvider } from '@/models/movies';

export default function MovieProviders() {
    return (
        <MyWatchProviders schema={MovieProvider} fetchData={getMovieProviders} />
    );
}
