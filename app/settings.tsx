import Setting from '@/components/Setting';
import { comicVine } from '@/integration/comicVine';
import { google } from '@/integration/google';
import { igdb } from '@/integration/igdb';
import { tmdb } from '@/integration/tmdb';
import { useBooksSettings, useComicsSettings, useGamesSettings, useMoviesAndTVSettings } from '@/util/state';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Settings() {

    return (
        <ScrollView>
            <View style={styles.container}>
                <Setting title="Movies and TV" state={useMoviesAndTVSettings()} api={tmdb} />
                {/* <Setting title="Books" state={useBooksSettings()} api={google} /> */}
                <Setting title="Games" state={useGamesSettings()} api={igdb} />
                {/* <Setting title="Comics" state={useComicsSettings()} api={comicVine} /> */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        marginBottom: 35,
        marginHorizontal: 20,
    },
});
