import { ExternalPathString } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ImageSourcePropType } from 'react-native';

export enum ApiKey {
    TheMovieDB = 'API_KEY_TMDB',
    Google = 'API_KEY_GOOGLE',
    GiantBomb = 'API_KEY_GIANT_BOMB',
    ComicVine = 'API_KEY_COMIC_VINE',
};

export type Api = {
    key: ApiKey;
    logo: ImageSourcePropType;
    name: string;
    url: ExternalPathString;
    validateKey: () => Promise<boolean>;
};

export async function getApiKey(key: ApiKey): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
}

export async function setApiKey(key: ApiKey, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
}

export function invalidApiKey(apiName: string): void {
    alert(`The API key for ${apiName} is invalid, please update it on the settings`);
}
