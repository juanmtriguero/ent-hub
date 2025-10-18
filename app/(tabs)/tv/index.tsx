import Index, { FetchSection, QuerySection } from '@/components/Index';
import { searchTV } from '@/integration/tmdb';
import { TV } from '@/models/tv';
import { getTVTile, tvStatusOptions } from '@/util/moviesAndTV';

const sections: (FetchSection | QuerySection)[] = [];

export default function TVIndex() {

    return (
        <Index buildTile={getTVTile} schema={TV} searchData={searchTV} searchOn="TV" sections={sections} statusOptions={tvStatusOptions} />
    );

}
