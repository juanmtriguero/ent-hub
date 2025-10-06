import Screen from '@/components/Screen';
import { getMovie, getMovieWatchProviders, IMAGE_URL, LOGO_SIZE } from '@/integration/tmdb';
import { getMovieScreen, getMovieStatus, movieStatusOptions, updateMovieStatus } from '@/util/movies';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MovieScreen() {

    const { movie } = useLocalSearchParams<{ movie: string }>();
    const [ watchProviders, setWatchProviders ] = useState<any>({});

    useEffect(() => {
        getMovieWatchProviders(movie)
        .then(watchProviders => {
            if (watchProviders) {
                setWatchProviders(watchProviders);
            }
        })
        .catch(error => {
            console.error(error);
        });
    }, [movie]);

    const renderWatchProviderSection = (title: string, providers: { logo_path: string, provider_id: string, provider_name: string }[]) => {
        if (providers?.length) {
            const renderWatchProviders = providers.map(({ logo_path, provider_id, provider_name }) => (
                <Image key={provider_id} source={`${IMAGE_URL}${LOGO_SIZE}/${logo_path}`} style={styles.watchProviderLogo} />
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

    const additionalContent = Object.keys(watchProviders).length ? (
        <View style={styles.watchProviderContainer}>
            <Text style={styles.watchProviderTitle}>Where to watch</Text>
            {renderWatchProviderSection('Streaming', watchProviders.flatrate)}
            {renderWatchProviderSection('Free (with ads)', watchProviders.ads)}
            {renderWatchProviderSection('Rent', watchProviders.rent)}
            {renderWatchProviderSection('Buy', watchProviders.buy)}
        </View>
    ) : null;

    return (
        <Screen additionalContent={additionalContent} buildScreen={getMovieScreen} fetchData={getMovie} getStatus={getMovieStatus} id={movie} statusOptions={movieStatusOptions} updateStatus={updateMovieStatus} />
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
