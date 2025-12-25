import { Api, ApiAuth, ApiCode } from '@/integration/main';

export const google: Api = {
    code: ApiCode.Google,
    auth: ApiAuth.ApiKey,
    logo: require('@/assets/logos/google.png'),
    name: 'Google',
    url: 'https://console.cloud.google.com/apis/credentials',
    // TODO: implement Google API key validation
    validateCredentials: () => Promise.resolve(false),
};
