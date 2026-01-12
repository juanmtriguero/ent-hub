import MyWatchProviders from '@/components/MyWatchProviders';
import { getTVProviders } from '@/integration/tmdb';
import { TVProvider } from '@/models/tv';

export default function TVProviders() {
    return (
        <MyWatchProviders schema={TVProvider} fetchData={getTVProviders} />
    );
}
