import { Api, ApiKey } from '@/integration/main';

export const google: Api = {
    key: ApiKey.Google,
    logo: require('@/assets/logos/google.png'),
    name: 'Google',
    url: 'https://console.cloud.google.com/apis/credentials',
    // TODO: implement Google API key validation
    validateKey: () => Promise.resolve(false),
};
