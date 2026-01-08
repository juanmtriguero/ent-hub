import { Api, ApiAuth, ApiCode } from '@/integration/main';

export const comicVine: Api = {
    code: ApiCode.ComicVine,
    auth: ApiAuth.ApiKey,
    logo: require('@/assets/logos/comic-vine.png'),
    name: 'Comic Vine',
    url: 'https://comicvine.gamespot.com/api/',
    // TODO: implement Comic Vine API key validation
    validateCredentials: () => Promise.resolve(false),
};
