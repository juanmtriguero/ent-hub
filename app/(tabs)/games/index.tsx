import Index, { FetchSection, QuerySection } from '@/components/Index';
import { getLatestGames, searchGames } from '@/integration/giantBomb';
import { Game, GameGenre } from '@/models/games';
import { getGameDetail, getGameTile, gameStatusOptions } from '@/util/games';

const sections: (FetchSection | QuerySection)[] = [
    {
        fetchData: getLatestGames,
        limit: 4,
        title: 'Latest games',
        viewAll: { pathname: '/games/latest' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'playing' ],
        getDetail: getGameDetail,
        limit: 4,
        title: 'Playing now',
        viewAll: { pathname: '/games/playing' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'paused' ],
        getDetail: getGameDetail,
        limit: 4,
        title: 'Resume playing',
        viewAll: { pathname: '/games/paused' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'pending' ],
        getDetail: getGameDetail,
        limit: 4,
        title: 'Want to play',
        viewAll: { pathname: '/games/pending' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'finished' ],
        getDetail: getGameDetail,
        limit: 4,
        title: 'Recently finished',
        viewAll: { pathname: '/games/finished' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'completed' ],
        getDetail: getGameDetail,
        limit: 4,
        title: 'Recently completed',
        viewAll: { pathname: '/games/completed' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'abandoned' ],
        getDetail: getGameDetail,
        limit: 4,
        title: 'Abandoned',
        viewAll: { pathname: '/games/abandoned' },
    },
];

export default function GamesIndex() {

    return (
        <Index<GameGenre, Game> buildTile={getGameTile} schema={Game} searchData={searchGames} searchOn="games" sections={sections} statusOptions={gameStatusOptions} />
    );

}
