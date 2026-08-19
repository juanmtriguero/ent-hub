import { Status } from '@/components/Screen';
import { Tile } from '@/components/TileList';
import { BACKDROP_SIZE, IMAGE_FORMAT, IMAGE_URL, LOGO_FORMAT, LOGO_SIZE, POSTER_SIZE } from '@/integration/igdb';
import { GameItem, GamePlatformItem } from '@/models/games';
import { Genre, PartialItem } from '@/models/interfaces';
import { Href } from 'expo-router';
import { PlatformColor } from 'react-native';

const getPosterUrl = (game: any): string | undefined => game.cover?.image_id?.length ? `${IMAGE_URL}${POSTER_SIZE}/${game.cover.image_id}${IMAGE_FORMAT}` : undefined;
const getBackdropUrl = (game: any): string | undefined => game.cover?.image_id?.length ? `${IMAGE_URL}${BACKDROP_SIZE}/${game.cover.image_id}${IMAGE_FORMAT}` : undefined;
const getReleaseYear = (game: any): string => game.first_release_date ? `${new Date(game.first_release_date * 1000).getFullYear()}` : '????';
const getGenres = (genres?: any[]): Genre[] => genres?.map(genre => ({ id: `${genre.id}`, name: genre.name })) ?? [];
const getLogoUrl = (platform: any): string | undefined => platform.platform_logo?.image_id?.length ? `${IMAGE_URL}${LOGO_SIZE}/${platform.platform_logo.image_id}${LOGO_FORMAT}` : undefined;
const getPlatformReleaseDate = (platform: any): Date | undefined => {
    return platform.versions?.reduce((latestDate: Date | undefined, version: any) => {
        return version.platform_version_release_dates?.reduce((latestReleaseDate: Date | undefined, releaseDate: any) => {
            if (releaseDate?.date) {
                const date = new Date(releaseDate.date * 1000);
                if (!latestReleaseDate || date > latestReleaseDate) {
                    return date;
                }
            }
            return latestReleaseDate;
        }, latestDate);
    }, undefined);
};

export const getGameDetail = (id: string): Href => ({
    pathname: '/games/[game]',
    params: { game: id },
});

export const getGameTile = (game: any): Tile => ({
    detail: getGameDetail(game.id),
    ...getPartialGame(game),
});

const getPartialGame = (game: any): PartialItem => ({
    id: `${game.id}`,
    posterUrl: getPosterUrl(game),
    releaseYear: getReleaseYear(game),
    title: game.name,
});

export const buildGame = (game: any): GameItem => ({
    id: `${game.id}`,
    backdropUrl: getBackdropUrl(game),
    description: game.summary,
    details: game.game_type.type,
    genres: getGenres(game.genres),
    related: game.similar_games?.map(getPartialGame) ?? [],
    originalTitle: game.name,
    posterUrl: getPosterUrl(game),
    releaseYear: getReleaseYear(game),
    title: game.name,
    url: game.url,
    rating: game.total_rating ? game.total_rating / 10 : 0,
    parentGame: game.parent_game ? getPartialGame(game.parent_game) : undefined,
    platforms: game.platforms?.map(buildPlatform) ?? [],
    dlcs: game.dlcs?.map(getPartialGame) ?? [],
    expandedGames: game.expanded_games?.map(getPartialGame) ?? [],
    expansions: game.expansions?.map(getPartialGame) ?? [],
    ports: game.ports?.map(getPartialGame) ?? [],
    remakes: game.remakes?.map(getPartialGame) ?? [],
    remasters: game.remasters?.map(getPartialGame) ?? [],
    standaloneExpansions: game.standalone_expansions?.map(getPartialGame) ?? [],
});

export const buildPlatform = (platform: any): GamePlatformItem => ({
    id: `${platform.id}`,
    name: platform.name,
    short: platform.abbreviation ?? platform.name,
    imageUrl: getLogoUrl(platform),
    releaseDate: getPlatformReleaseDate(platform),
});

export const gameStatusOptions: Status[] = [
    { label: 'Want to play', value: 'pending', icon: 'bookmark', color: PlatformColor('systemOrange') },
    { label: 'Playing', value: 'playing', icon: 'play', color: PlatformColor('systemBlue') },
    { label: 'Paused', value: 'paused', icon: 'pause', color: PlatformColor('systemYellow') },
    { label: 'Finished', value: 'finished', icon: 'checkmark', color: PlatformColor('systemGreen') },
    { label: 'Completed', value: 'completed', icon: 'trophy', color: PlatformColor('systemPurple') },
    { label: 'Abandoned', value: 'abandoned', icon: 'xmark', color: PlatformColor('systemRed') },
];
