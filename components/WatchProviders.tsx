import { WatchProvider } from '@/models/interfaces';
import { Image } from 'expo-image';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    flatrate?: WatchProvider[];
    ads?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
};

export default function WatchProviders({ flatrate, ads, rent, buy }: Props) {

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

    if (flatrate?.length || ads?.length || rent?.length || buy?.length) {
        return (
            <View style={styles.watchProviderContainer}>
                <Text style={styles.watchProviderTitle}>Where to watch</Text>
                {renderWatchProviderSection('Streaming', flatrate)}
                {renderWatchProviderSection('Free (with ads)', ads)}
                {renderWatchProviderSection('Rent', rent)}
                {renderWatchProviderSection('Buy', buy)}
            </View>
        );
    }

    return null;

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
