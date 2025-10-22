import StatusPage from '@/components/StatusPage';
import TVFilter, { buildTVQuery } from '@/components/TVFilter';
import { TV } from '@/models/tv';
import { getTVDetail, tvStatusOptions } from '@/util/moviesAndTV';

export default function TVWatching() {

    return (
        <StatusPage buildQuery={buildTVQuery} FilterComponent={TVFilter} getDetail={getTVDetail} schema={TV} status="watching" statusOptions={tvStatusOptions} />
    );

}
