
import GameFilter, { buildGameQuery } from '@/components/GameFilter';
import StatusPage from '@/components/StatusPage';
import { Game, GameGenre } from '@/models/games';
import { gameStatusOptions, getGameDetail } from '@/util/games';

export default function GamesCompleted() {

    return (
        <StatusPage<GameGenre, Game> buildQuery={buildGameQuery} FilterComponent={GameFilter} getDetail={getGameDetail} schema={Game} status="completed" statusOptions={gameStatusOptions} />
    );

}