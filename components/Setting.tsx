import { ApiKey, apiKeys, getApiKey, setApiKey } from '@/integration/apikeys';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Alert, Button, PlatformColor, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

type Props = {
    apiKey: ApiKey;
    enabled: boolean;
    title: string;
};

export default function Setting({ apiKey, enabled, title }: Props) {

    const apiKeyProps = apiKeys[apiKey];

    const [ isEnabled, setIsEnabled ] = useState(enabled);
    const [ key, setKey ] = useState('');
    const [ isValidApiKey, setIsValidApiKey ] = useState(false);

    useEffect(() => {
        getApiKey(apiKey).then(key => {
            if (key) {
                setKey(key);
            }
        }).catch(error => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        setIsValidApiKey(false);
    }, [key]);

    const validateApiKey = () => {
        setApiKey(apiKey, key).then(() => {
            return apiKeyProps.validate();
        })
        .then(isValid => {
            setIsValidApiKey(isValid);
            if (isValid) {
                Alert.alert('Valid API key', 'The API key has been validated successfully');
            } else {
                Alert.alert('Invalid API key', 'The API key is invalid, please add a valid API key');
            }
        })
        .catch(error => {
            console.error(error);
            setIsValidApiKey(false);
            Alert.alert('Error', 'Something went wrong, please try again');
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Switch onValueChange={() => setIsEnabled(value => !value)} value={isEnabled} />
            </View>
            {isEnabled ? (
                <View style={styles.body}>
                    <View style={styles.logoContainer}>
                        <Image source={apiKeyProps.logo} style={styles.logo} contentFit="contain" />
                        <View>
                            <Text>Powered by</Text>
                            <Text style={styles.name}>{apiKeyProps.name}</Text>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput value={key} onChangeText={setKey} secureTextEntry={true} placeholder="Add an API key" style={styles.input} />
                        <Button title="Validate" onPress={validateApiKey} disabled={!key.length || isValidApiKey} />
                    </View>
                    <View style={styles.linkContainer}>
                        <Link href={apiKeyProps.url} style={styles.link}>Get an API key </Link>
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
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
