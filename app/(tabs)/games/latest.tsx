import FetchList from '@/components/FetchList';
import GameFilter, { GameFilterParams } from '@/components/GameFilter';
import { getLatestGames } from '@/integration/igdb';
import { Game, GameGenre } from '@/models/games';
import { gameStatusOptions, getGameTile } from '@/util/games';
import { useState } from 'react';
import { FlatList, View } from 'react-native';

export default function GamesLatest() {

    const [ filter, setFilter ] = useState<GameFilterParams>({});

    return (
        <View>
            <FlatList data={[
                <GameFilter key="filter" onChange={setFilter} />,
                <FetchList<GameGenre, Game> key="list" schema={Game} statusOptions={gameStatusOptions} buildTile={getGameTile} fetchData={getLatestGames} params={filter} />,
            ]} renderItem={({ item }: { item: React.JSX.Element }) => item} />
        </View>
    );

}