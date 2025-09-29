import Setting from '@/components/Setting';
import { comicVine } from '@/integration/comicVine';
import { giantBomb } from '@/integration/giantBomb';
import { google } from '@/integration/google';
import { tmdb } from '@/integration/tmdb';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Settings() {

    // TODO: get and persist enabled flags on settings.json

    return (
        <ScrollView>
            <View style={styles.container}>
                <Setting title="Movies and TV" enabled={false} api={tmdb} />
                <Setting title="Books" enabled={false} api={google} />
                <Setting title="Games" enabled={false} api={giantBomb} />
                <Setting title="Comics" enabled={false} api={comicVine} />
            </View>
        </ScrollView>
        // TODO: export button
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        marginBottom: 35,
        marginHorizontal: 20,
    },
});
