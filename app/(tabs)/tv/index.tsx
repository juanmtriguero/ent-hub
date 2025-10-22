import Index, { FetchSection, QuerySection } from '@/components/Index';
import { getPopularShows, searchTV } from '@/integration/tmdb';
import { TV } from '@/models/tv';
import { getTVDetail, getTVTile, tvStatusOptions } from '@/util/moviesAndTV';

const sections: (FetchSection | QuerySection)[] = [
    {
        fetchData: getPopularShows,
        limit: 4,
        title: 'Popular shows',
        viewAll: { pathname: '/tv/popular' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'watching' ],
        getDetail: getTVDetail,
        limit: 4,
        title: 'Watching now',
        viewAll: { pathname: '/tv/watching' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'paused' ],
        getDetail: getTVDetail,
        limit: 4,
        title: 'Resume watching',
        viewAll: { pathname: '/tv/paused' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'pending' ],
        getDetail: getTVDetail,
        limit: 4,
        title: 'My watchlist',
        viewAll: { pathname: '/tv/pending' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'watched' ],
        getDetail: getTVDetail,
        limit: 4,
        title: 'Recently watched',
        viewAll: { pathname: '/tv/watched' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'abandoned' ],
        getDetail: getTVDetail,
        limit: 4,
        title: 'Abandoned',
        viewAll: { pathname: '/tv/abandoned' },
    },
];

export default function TVIndex() {

    return (
        <Index buildTile={getTVTile} schema={TV} searchData={searchTV} searchOn="TV" sections={sections} statusOptions={tvStatusOptions} />
    );

}
