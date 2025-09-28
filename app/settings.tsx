import Setting from '@/components/Setting';
import { ApiKey } from '@/integration/apikeys';
import { ScrollView, StyleSheet } from 'react-native';

export default function Settings() {

    // TODO: get and persist enabled flags on settings.json

    return (
        // FIXME: fix margins
        <ScrollView style={styles.container}>
            <Setting title="Movies and TV" enabled={false} apiKey={ApiKey.TheMovieDB} />
            <Setting title="Books" enabled={false} apiKey={ApiKey.Google} />
            <Setting title="Games" enabled={false} apiKey={ApiKey.GiantBomb} />
            <Setting title="Comics" enabled={false} apiKey={ApiKey.ComicVine} />
        </ScrollView>
        // TODO: export button
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        marginHorizontal: 20,
    },
});
