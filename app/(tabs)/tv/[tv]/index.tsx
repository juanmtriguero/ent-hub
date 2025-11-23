import Screen from '@/components/Screen';
import WatchProviders from '@/components/WatchProviders';
import { TV, TVGenre, TVItem, TVProvider, TVSeason, TVSeasonItem } from '@/models/tv';
import { getTV } from '@/integration/tmdb';
import { buildTV, getSeasonProgress, openTVInBrowser, tvStatusOptions } from '@/util/moviesAndTV';
import { Image } from 'expo-image';
import { Realm } from '@realm/react';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';

const posterPlaceholder = require('@/assets/images/poster.png');

export default function TVScreen() {

    const { tv } = useLocalSearchParams<{ tv: string }>();

    const renderProgress = (item: TV) => {
        if (item) {
            const { watched, total } = item?.seasons.reduce((acc, season) => {
                if (season.number) {
                    acc.watched += season.episodes.filtered('watched == true').length;
                    acc.total += season.count;
                }
                return acc;
            }, { watched: 0, total: 0 });
            const text = total === watched ? 'Up to date' : `${total - watched} episodes remaining`;
            return (
                <View style={styles.progressContainer}>
                    <View style={{ ...styles.progress, width: `${(watched / total) * 100}%` }} />
                    <Text style={styles.progressText}>{text}</Text>
                </View>
            );
        }
        return null;
    }

    const navigateToSeason = (season: TVSeasonItem | TVSeason) => {
        router.navigate({
            pathname: '/tv/[tv]/[season]',
            params: { tv, season: season.number },
        });
    };

    const renderSeason = ({ item }: { item: TVSeasonItem | TVSeason }) => (
        <Pressable onPress={() => navigateToSeason(item)} style={styles.season}>
            <Image source={item.posterUrl} style={styles.seasonPoster} contentFit="cover" placeholder={posterPlaceholder} placeholderContentFit="cover" />
            { item instanceof TVSeason ? (
                <View style={{ ...styles.seasonProgress, width: `${getSeasonProgress(item) * 100}%` }} />
            ) : null }
            <View style={styles.seasonContainer}>
                <Text style={styles.seasonName} numberOfLines={1}>{item.name}</Text>
                <Text>{item.airDate ? item.airDate.toLocaleDateString('es-ES') : null}</Text>
            </View>
        </Pressable>
    );

    const additionalContent = (item: TVItem | TV) => {
        const isSavedItem = item instanceof TV;
        const seasons = isSavedItem ? item?.seasons.sorted('number', true) : item.seasons.sort((a, b) => b.number - a.number);
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Seasons</Text>
                { isSavedItem ? renderProgress(item) : null }
                <FlatList data={seasons} renderItem={renderSeason} horizontal contentContainerStyle={styles.separator} />
                <WatchProviders<TVProvider> flatrate={item.flatrate} />
            </View>
        );
    };

    const deleteOrphans = (realm: Realm) => {
        realm.delete(realm.objects('TVSeason').filtered('parent.@count == 0'));
        realm.delete(realm.objects('TVEpisode').filtered('parent.@count == 0'));
    };

    return (
        <Screen<TVItem, TVGenre, TV> additionalContent={additionalContent} buildItem={buildTV} fetchData={getTV} id={tv} openInBrowser={openTVInBrowser} schema={TV} statusOptions={tvStatusOptions} deleteOrphans={deleteOrphans} />
    );

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 10,
        marginTop: 10,
    },
    progress: {
        position: 'absolute',
        height: '100%',
        backgroundColor: PlatformColor('systemGreen'),
    },
    progressContainer: {
        backgroundColor: 'lightgray',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressText: {
        fontSize: 12,
        textAlign: 'center',
        margin: 4,
    },
    season: {
        width: 150,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        overflow: 'hidden',
    },
    seasonContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    seasonName: {
        fontWeight: 'bold',
    },
    seasonPoster: {
        height: 225,
    },
    seasonProgress: {
        position: 'absolute',
        top: 220,
        height: 5,
        backgroundColor: PlatformColor('systemGreen'),
    },
    separator: {
        gap: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});
