import { Api, ApiKey } from '@/integration/main';

export const giantBomb: Api = {
    key: ApiKey.GiantBomb,
    logo: require('@/assets/logos/giant-bomb.png'),
    name: 'Giant Bomb',
    url: 'https://www.giantbomb.com/api/',
    // TODO: implement Giant Bomb API key validation
    validateKey: () => Promise.resolve(false),
};
