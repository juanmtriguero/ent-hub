// FIXME: fix require cycle
import { authenticate } from '@/integration/tmdb';
import { ExternalPathString } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ImageSourcePropType } from 'react-native';

export enum ApiKey {
    TheMovieDB = 'API_KEY_TMDB',
    Google = 'API_KEY_GOOGLE',
    GiantBomb = 'API_KEY_GIANT_BOMB',
    ComicVine = 'API_KEY_COMIC_VINE',
};

export type ApiKeyProps = {
    logo: ImageSourcePropType;
    name: string;
    url: ExternalPathString;
    validate: () => Promise<boolean>;
};

export const apiKeys: Record<ApiKey, ApiKeyProps> = {
    [ApiKey.TheMovieDB]: {
        logo: require('@/assets/logos/tmdb.png'),
        name: 'The Movie Database',
        url: 'https://www.themoviedb.org/settings/api',
        validate: authenticate,
    },
    [ApiKey.Google]: {
        logo: require('@/assets/logos/google.png'),
        name: 'Google',
        url: 'https://console.cloud.google.com/apis/credentials',
        // TODO: implement Google API key validation
        validate: () => Promise.resolve(false),
    },
    [ApiKey.GiantBomb]: {
        logo: require('@/assets/logos/giant-bomb.png'),
        name: 'Giant Bomb',
        url: 'https://www.giantbomb.com/api/',
        // TODO: implement Giant Bomb API key validation
        validate: () => Promise.resolve(false),
    },
    [ApiKey.ComicVine]: {
        logo: require('@/assets/logos/comic-vine.png'),
        name: 'Comic Vine',
        url: 'https://comicvine.gamespot.com/api/',
        // TODO: implement Comic Vine API key validation
        validate: () => Promise.resolve(false),
    },
};

export async function getApiKey(key: ApiKey): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
}

export async function setApiKey(key: ApiKey, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
}

export function invalidApiKey(key: ApiKey): void {
    alert(`The API key for ${apiKeys[key].name} is invalid, please update it on the settings`);
}
