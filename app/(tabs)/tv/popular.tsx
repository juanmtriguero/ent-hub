import FetchList from '@/components/FetchList';
import TVFilter, { TVFilterParams } from '@/components/TVFilter';
import { getPopularShows } from '@/integration/tmdb';
import { TV, TVGenre } from '@/models/tv';
import { getTVTile, tvStatusOptions } from '@/util/moviesAndTV';
import { useState } from 'react';
import { FlatList, View } from 'react-native';

export default function TVPopular() {

    const [ filter, setFilter ] = useState<TVFilterParams>({});

    return (
        <View>
            <FlatList data={[
                <TVFilter key="filter" onChange={setFilter} />,
                <FetchList<TVGenre, TV> key="list" schema={TV} statusOptions={tvStatusOptions} buildTile={getTVTile} fetchData={getPopularShows} params={filter} />,
            ]} renderItem={({ item }: { item: React.JSX.Element }) => item} />
        </View>
    );

}