import { TV, TVEpisode, TVSeason } from '@/models/tv';
import { getTVDetail } from '@/util/moviesAndTV';
import { useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { FlatList, PlatformColor, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

type NextEpisode = {
    tvId: string;
    tvTitle: string;
    seasonName: string;
    episode: TVEpisode;
};

export default function NextEpisodes() {

    const watchingTV = useQuery(TV).filtered('status == $0', 'watching').sorted('timestamp', true);
    const realm = useRealm();
    const nextEpisodes = useMemo(() => watchingTV.reduce((results: NextEpisode[], tv) => {
        const now = new Date();
        for (const season of tv.seasons.filtered('number > 0').sorted('number')) {
            const episode = season.episodes.filtered('watched == false AND airDate < $0', now).sorted('number')[0];
            if (episode) {
                results.push({
                    tvId: tv.id,
                    tvTitle: tv.title,
                    seasonName: season.name,
                    episode: episode,
                });
                break;
            }
        }
        return results;
    }, []), [watchingTV]);
    const { width } = useWindowDimensions();

    const renderItem = ({ item }: { item: NextEpisode }) => {
        const navigateToTV = () => {
            router.navigate(getTVDetail(item.tvId));
        };
        return (
            <Pressable onPress={navigateToTV} style={styles.episode}>
                <Image source={item.episode.stillUrl} style={styles.episodeImage} contentFit="cover" />
                <View style={styles.episodeBody}>
                    <Text style={styles.title} numberOfLines={1}>{item.tvTitle}</Text>
                    <Text numberOfLines={1}>{item.seasonName}, Ep. {item.episode.number}</Text>
                    <Text style={styles.episodeName} numberOfLines={1}>{item.episode.name}</Text>
                </View>
                <View style={styles.episodeAction}>
                    <Pressable onPress={() => realm.write(() => item.episode.watched = true)}>
                        <SymbolView name="eye.circle" size={width / 10} />
                    </Pressable>
                </View>
            </Pressable>
        );
    };

    const nothingToWatch = () => {
        return (
            <View style={styles.message}>
                <SymbolView name="checkmark.rectangle.fill" size={30} tintColor={PlatformColor('systemGreen')} />
                <Text>Congratulations, you are all caught up!</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Watch today</Text>
            </View>
            <FlatList data={nextEpisodes} renderItem={renderItem} ListEmptyComponent={nothingToWatch} />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        marginBottom: 0,
    },
    episode: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        flexDirection: 'row',
        marginBottom: 10,
    },
    episodeAction: {
        width: '12%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    episodeBody: {
        width: '55%',
        padding: 10,
        gap: 3,
    },
    episodeImage: {
        width: '33%',
        backgroundColor: PlatformColor('systemGray3'),
    },
    episodeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        marginVertical: 10,
        marginHorizontal: 5,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    message: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginVertical: 10,
        marginHorizontal: 5,
    },
    title: {
        color: PlatformColor('secondaryLabel'),
    }
});
