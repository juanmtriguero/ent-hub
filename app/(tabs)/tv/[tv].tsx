import Screen from '@/components/Screen';
import WatchProviders from '@/components/WatchProviders';
import { TV } from '@/models/tv';
import { getTV } from '@/integration/tmdb';
import { buildTV, tvStatusOptions } from '@/util/moviesAndTV';
import { useLocalSearchParams } from 'expo-router';

export default function TVScreen() {

    const { tv } = useLocalSearchParams< { tv: string }>();

    const additionalContent = (item: TV) => (
        <WatchProviders flatrate={item.flatrate} />
    );

    return (
        <Screen additionalContent={additionalContent} buildItem={buildTV} fetchData={getTV} id={tv} schema={TV} statusOptions={tvStatusOptions} />
    );

}
