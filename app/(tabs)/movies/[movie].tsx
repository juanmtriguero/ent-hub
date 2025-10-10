import Screen from '@/components/Screen';
import { getMovie } from '@/integration/tmdb';
import { Movie } from '@/schema/movies';
import { getMovieScreen, movieStatusOptions, WatchProvider, WatchProviders } from '@/util/movies';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function MovieScreen() {

    const { movie } = useLocalSearchParams<{ movie: string }>();

    const renderWatchProviderSection = (title: string, providers?: WatchProvider[]) => {
        if (providers?.length) {
            const renderWatchProviders = providers.map(({ id, logoUrl }) => (
                <Image key={id} source={logoUrl} style={styles.watchProviderLogo} />
            ));
            return (
                <View key={title} style={styles.watchProviderSection}>
                    <Text style={styles.watchProviderSectionTitle}>{title}</Text>
                    <View style={styles.watchProviderSectionBody}>
                        {renderWatchProviders}
                    </View>
                </View>
            );
        }
        return null;
    };

    const additionalContent = ({ watchProviders }: { watchProviders: WatchProviders }) => Object.keys(watchProviders).length ? (
        <View style={styles.watchProviderContainer}>
            <Text style={styles.watchProviderTitle}>Where to watch</Text>
            {renderWatchProviderSection('Streaming', watchProviders.flatrate)}
            {renderWatchProviderSection('Free (with ads)', watchProviders.ads)}
            {renderWatchProviderSection('Rent', watchProviders.rent)}
            {renderWatchProviderSection('Buy', watchProviders.buy)}
        </View>
    ) : null;

    return (
        <Screen additionalContent={additionalContent} buildScreen={getMovieScreen} fetchData={getMovie} id={movie} schema={Movie} statusOptions={movieStatusOptions} />
    );

}

const styles = StyleSheet.create({
    watchProviderLogo: {
        width: 60,
        height: 60,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        overflow: 'hidden',
    },
    watchProviderContainer: {
        marginTop: 10,
        flexDirection: 'column',
        gap: 10,
    },
    watchProviderTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    watchProviderSection: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    watchProviderSectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    watchProviderSectionBody: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
});
