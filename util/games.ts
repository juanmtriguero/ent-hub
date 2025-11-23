import { Status } from '@/components/Screen';
import { Tile } from '@/components/TileList';
import { GameFranchiseItem, GameItem, GamePlatformItem } from '@/models/games';
import { Genre } from '@/models/interfaces';
import { ExternalPathString, Href } from 'expo-router';
import { PlatformColor } from 'react-native';

const getReleaseYear = (game: any): string => `${(game.original_release_date ? new Date(game.original_release_date).getFullYear() : game.expected_release_year) ?? '????'}`;
const getGenres = (genres?: any[]): Genre[] => genres?.map(genre => ({ id: `${genre.id}`, name: genre.name })) ?? [];
const getPlatforms = (platforms?: any[]): GamePlatformItem[] => platforms?.map(platform => ({ id: `${platform.id}`, name: platform.name, short: platform.abbreviation })) ?? [];

export const getGameDetail = (id: string): Href => ({
    pathname: '/games/[game]',
    params: { game: id },
});

export const getGameTile = (game: any): Tile => ({
    detail: getGameDetail(game.id),
    id: `${game.id}`,
    posterUrl: game.image.small_url,
    releaseYear: getReleaseYear(game),
    title: game.name,
});

export const buildFranchise = (franchise: any): GameFranchiseItem => ({
    id: `${franchise.id}`,
    name: franchise.name,
    description: franchise.deck,
    imageUrl: franchise.image?.screen_url,
});

export const buildGame = (game: any): GameItem => ({
    id: `${game.id}`,
    backdropUrl: game.image.screen_large_url,
    description: game.deck,
    details: game.developers?.map((developer: any) => developer.name).join(', '),
    genres: getGenres(game.genres),
    originalTitle: game.name,
    posterUrl: game.image.small_url,
    releaseYear: getReleaseYear(game),
    title: game.name,
    platforms: getPlatforms(game.platforms),
    franchises: game.franchises?.map(buildFranchise) ?? [],
});

export const buildPlatform = (platform: any): GamePlatformItem => ({
    id: `${platform.id}`,
    name: platform.name,
    short: platform.abbreviation,
    imageUrl: platform.image?.icon_url,
    releaseDate: platform.release_date ? new Date(platform.release_date) : undefined,
});

export const gameStatusOptions: Status[] = [
    { label: 'Want to play', value: 'pending', icon: 'bookmark', color: PlatformColor('systemOrange') },
    { label: 'Playing', value: 'playing', icon: 'play', color: PlatformColor('systemBlue') },
    { label: 'Paused', value: 'paused', icon: 'pause', color: PlatformColor('systemYellow') },
    { label: 'Finished', value: 'finished', icon: 'checkmark', color: PlatformColor('systemGreen') },
    { label: 'Completed', value: 'completed', icon: 'trophy', color: PlatformColor('systemPurple') },
    { label: 'Abandoned', value: 'abandoned', icon: 'xmark', color: PlatformColor('systemRed') },
];

export const openGameInBrowser = (id: string): ExternalPathString => `https://www.giantbomb.com/game/3030-${id}`;
