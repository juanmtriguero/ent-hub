import Setting from '@/components/Setting';
import { comicVine } from '@/integration/comicVine';
import { giantBomb } from '@/integration/giantBomb';
import { google } from '@/integration/google';
import { tmdb } from '@/integration/tmdb';
import { useBooksSettings, useComicsSettings, useGamesSettings, useMoviesAndTVSettings } from '@/util/state';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, PlatformColor, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {

    const moviesAndTVSettings = useMoviesAndTVSettings();
    const booksSettings = useBooksSettings();
    const gamesSettings = useGamesSettings();
    const comicsSettings = useComicsSettings();
    const [ redirect, setRedirect ] = useState<boolean>(true);

    useEffect(() => {
        setRedirect(false);
    }, []);

    if (redirect) {
        if (moviesAndTVSettings.enabled) {
            return <Redirect href="/(tabs)/movies" />;
        }
        if (booksSettings.enabled) {
            return <Redirect href="/(tabs)/books" />;
        }
        if (gamesSettings.enabled) {
            return <Redirect href="/(tabs)/games" />;
        }
        if (comicsSettings.enabled) {
            return <Redirect href="/(tabs)/comics" />;
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Welcome to <Text style={styles.logo}>EntHub</Text></Text>
                    <View style={styles.headerText}>
                        <Text style={styles.textCenter}>Please select the services you want to use</Text>
                        <Text style={styles.textCenter}>For each service, you will need to add an API key to access the data from the external website</Text>
                        <Text style={styles.textCenter}>You can change your selections later in the settings</Text>
                    </View>
                </View>
                <View style={styles.settings}>
                    <Setting title="Movies and TV" state={moviesAndTVSettings} api={tmdb} />
                    <Setting title="Books" state={booksSettings} api={google} />
                    <Setting title="Games" state={gamesSettings} api={giantBomb} />
                    <Setting title="Comics" state={comicsSettings} api={comicVine} />
                </View>
                <View style={styles.footer}>
                    <Button title="I am ready" onPress={() => setRedirect(true)} disabled={!moviesAndTVSettings.enabled && !booksSettings.enabled && !gamesSettings.enabled && !comicsSettings.enabled} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    footer: {
        margin: 20,
    },
    header: {
        margin: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        gap: 5,
        color: PlatformColor('secondaryLabel'),
    },
    headerTitle: {
        fontSize: 30,
        marginBottom: 10,
    },
    logo: {
        fontWeight: 'bold',
        color: PlatformColor('systemBlue'),
    },
    settings: {
        marginHorizontal: 20,
    },
    textCenter: {
        textAlign: 'center',
    },
});
