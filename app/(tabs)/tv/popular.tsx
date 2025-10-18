import FetchList from '@/components/FetchList';
import { getPopularShows } from '@/integration/tmdb';
import { TV } from '@/models/tv';
import { getTVTile, tvStatusOptions } from '@/util/moviesAndTV';
import { FlatList, View } from 'react-native';

export default function TVPopular() {

    return (
        <View>
            <FlatList data={[
                <FetchList schema={TV} statusOptions={tvStatusOptions} buildTile={getTVTile} fetchData={getPopularShows} params={{}} />,
            ]} renderItem={({ item }: { item: React.JSX.Element }) => item} />
        </View>
    );

}