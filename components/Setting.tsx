import { Api, ApiAuth, getCredentials, setCredentials } from '@/integration/main';
import { SettingsState } from '@/util/state';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, Button, PlatformColor, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

type Props = {
    api: Api;
    state: SettingsState;
    title: string;
};

export default function Setting({ api, title, state }: Props) {

    const [ key, setKey ] = useState('');
    const [ clientId, setClientId ] = useState('');
    const [ clientSecret, setClientSecret ] = useState('');
    const [ isEmptyCredentials, setIsEmptyCredentials ] = useState(false);
    const [ isValidCredentials, setIsValidCredentials ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    let linkText = '';
    switch (api.auth) {
        case ApiAuth.ApiKey:
            linkText = 'Get an API key';
            break;
        case ApiAuth.OAuth2ClientCredentials:
            linkText = 'Get the Client Credentials';
            break;
    }

    useEffect(() => {
        getCredentials(api).then(credentials => {
            if (credentials?.length) {
                switch (api.auth) {
                    case ApiAuth.ApiKey:
                        setKey(credentials);
                        break;
                    case ApiAuth.OAuth2ClientCredentials:
                        const { clientId, clientSecret } = JSON.parse(credentials);
                        setClientId(clientId);
                        setClientSecret(clientSecret);
                        break;
                }
            }
        }).catch(error => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        switch (api.auth) {
            case ApiAuth.ApiKey:
                setIsEmptyCredentials(!key?.length);
                break;
            case ApiAuth.OAuth2ClientCredentials:
                setIsEmptyCredentials(!clientId?.length || !clientSecret?.length);
                break;
        }
        setIsValidCredentials(false);
    }, [ key, clientId, clientSecret ]);

    const validateCredentials = () => {
        setIsLoading(true);
        let newCredentials = '';
        switch (api.auth) {
            case ApiAuth.ApiKey:
                newCredentials = key;
                break;
            case ApiAuth.OAuth2ClientCredentials:
                newCredentials = JSON.stringify({ clientId, clientSecret });
                break;
        }
        setCredentials(api, newCredentials).then(() => {
            return api.validateCredentials();
        })
        .then(isValid => {
            setIsValidCredentials(isValid);
            if (isValid) {
                Alert.alert('Valid credentials', 'The credentials have been validated successfully');
            } else {
                Alert.alert('Invalid credentials', 'The credentials are invalid, please add valid credentials');
            }
        })
        .catch(error => {
            console.error(error);
            setIsValidCredentials(false);
            Alert.alert('Error', 'Something went wrong, please try again');
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Switch onValueChange={state.toggleEnabled} value={state.enabled} />
            </View>
            {state.enabled ? (
                <View style={styles.body}>
                    <View style={styles.logoContainer}>
                        <Image source={api.logo} style={styles.logo} contentFit="contain" />
                        <View>
                            <Text>Powered by</Text>
                            <Text style={styles.name}>{api.name}</Text>
                        </View>
                    </View>
                    { api.auth === ApiAuth.OAuth2ClientCredentials ? (
                        <View style={styles.inputContainer}>
                            <TextInput value={clientId} onChangeText={setClientId} placeholder="Add the Client ID" style={styles.input} editable={!isLoading} />
                        </View>
                    ) : null }
                    <View style={styles.inputContainer}>
                        { api.auth === ApiAuth.ApiKey ? (
                            <TextInput value={key} onChangeText={setKey} secureTextEntry placeholder="Add an API key" style={styles.input} editable={!isLoading} />
                        ) : null }
                        { api.auth === ApiAuth.OAuth2ClientCredentials ? (
                            <TextInput value={clientSecret} onChangeText={setClientSecret} secureTextEntry placeholder="Add the Client Secret" style={styles.input} editable={!isLoading} />
                        ) : null }
                        <View>
                            <Button title="Validate" onPress={validateCredentials} disabled={isEmptyCredentials || isValidCredentials || isLoading} />
                            { isLoading ? <ActivityIndicator style={styles.spinner} /> : null }
                        </View>
                    </View>
                    <View style={styles.linkContainer}>
                        <Link href={api.url} style={styles.link}>{linkText} </Link>
                        <SymbolView name="arrow.up.right.square" size={16} />
                    </View>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        marginVertical: 10,
    },
    container: {
        marginVertical: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 10,
        marginTop: 10,
    },
    link: {
        color: PlatformColor('systemBlue'),
        textDecorationLine: 'underline',
    },
    linkContainer: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    logo: {
        width: 50,
        height: 50,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    name: {
        fontWeight: 'bold',
    },
    spinner: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        zIndex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
