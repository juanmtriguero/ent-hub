import { Api, ApiKey } from '@/integration/main';

export const comicVine: Api = {
    key: ApiKey.ComicVine,
    logo: require('@/assets/logos/comic-vine.png'),
    name: 'Comic Vine',
    url: 'https://comicvine.gamespot.com/api/',
    // TODO: implement Comic Vine API key validation
    validateKey: () => Promise.resolve(false),
};
