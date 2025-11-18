import { SavedProvider, WatchProvider } from '@/models/interfaces';
import { Realm } from '@realm/react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet } from 'react-native';

const justWatchLogo = require('@/assets/logos/just-watch.png');

type Props<S extends SavedProvider> = {
    flatrate?: WatchProvider[] | Realm.List<S>;
    ads?: WatchProvider[] | Realm.List<S>;
    rent?: WatchProvider[] | Realm.List<S>;
    buy?: WatchProvider[] | Realm.List<S>;
};

export default function WatchProviders<S extends SavedProvider>({ flatrate, ads, rent, buy }: Props<S>) {

    const renderWatchProviderSection = (title: string, providers?: WatchProvider[] | Realm.List<S>) => {
        if (providers?.length) {
            const renderWatchProviders = providers.map(({ id, logoUrl }) => (
                <Image key={id} source={logoUrl} style={styles.logo} />
            ));
            return (
                <View key={title} style={styles.section}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <View style={styles.sectionBody}>
                        {renderWatchProviders}
                    </View>
                </View>
            );
        }
        return null;
    };

    if (flatrate?.length || ads?.length || rent?.length || buy?.length) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Where to watch</Text>
                    <View style={styles.justWatch}>
                        <Text>Powered by</Text>
                        <Image source={justWatchLogo} style={styles.justWatchLogo} />
                    </View>
                </View>
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
    container: {
        marginTop: 10,
        flexDirection: 'column',
        gap: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    justWatch: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    justWatchLogo: {
        width: 80,
        height: 20,
        borderRadius: 5,
        overflow: 'hidden',
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'lightgray',
        overflow: 'hidden',
    },
    section: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    sectionBody: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});
