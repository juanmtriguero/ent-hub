import { getTVSeason } from '@/integration/tmdb';
import { TVEpisode, TVSeason } from '@/models/tv';
import { buildTVSeason } from '@/util/moviesAndTV';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, PlatformColor, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

export default function TVSeasonScreen() {

    const { tv, season } = useLocalSearchParams<{ tv: string, season: string }>();
    const navigation = useNavigation();
    const savedTVSeason = useQuery(TVSeason).filtered('tv.id == $0 AND number == $1', tv, season)[0];
    const savedEpisodes = useQuery(TVEpisode).filtered('tvSeason.id == $0', savedTVSeason?.id);
    const realm = useRealm();
    const [ tvSeason, setTVSeason ] = useState<TVSeason | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const { width, height } = useWindowDimensions();
    const styles = getStyles(width, height);

    useEffect(() => {
        setIsLoading(true);
        getTVSeason(tv, season)
        .then(data => {
            const tvSeason = buildTVSeason(data);
            setTVSeason(tvSeason);
            if (savedTVSeason) {
                realm.write(() => {
                    realm.create(TVSeason, tvSeason, Realm.UpdateMode.Modified);
                });
            }
        })
        .catch(error => {
            console.error(error);
            setTVSeason(savedTVSeason);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [ tv, season ]);

    useEffect(() => {
        navigation.setOptions({
            title: tvSeason?.name,
            headerRight: watchAll,
        });
    }, [ navigation, tvSeason ]);

    const watchAll = () => savedEpisodes?.length ? (
        <Pressable onPress={() => {realm.write(() => savedEpisodes.forEach(episode => episode.watched = true))}}>
            <SymbolView name="eye.fill" size={30} />
        </Pressable>
    ) : null;

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!tvSeason) {
        return (
            <View style={styles.centered}>
                <Text style={styles.centeredText}>There was an error loading the details, please try again later</Text>
            </View>
        );
    }

    const renderEpisode = ({ item }: { item: TVEpisode }) => {
        const properties = [];
        if (item.airDate) {
            properties.push(item.airDate.toLocaleDateString('es-ES'));
        }
        if (item.duration) {
            properties.push(`${item.duration}'`);
        }
        const savedEpisode = savedEpisodes.filtered('id == $0', item.id)[0];
        return (
            <View style={styles.episode}>
                <View style={styles.episodeHeader}>
                    <Image source={item.stillUrl} style={styles.episodeImage} contentFit="cover" />
                    <View style={styles.episodeBody}>
                        <Text style={styles.episodeName} numberOfLines={2}>{item.number}. {item.name}</Text>
                        <Text>{properties.join(' | ')}</Text>
                    </View>
                    {savedEpisode ? (
                        <Pressable onPress={() => realm.write(() => savedEpisode.watched = !savedEpisode.watched)} style={{ ...styles.episodeStatus, backgroundColor: PlatformColor(savedEpisode.watched ? 'systemGreen' : 'systemGray') }}>
                            <SymbolView name={savedEpisode.watched ? 'eye.fill' : 'eye.slash.fill'} size={width / 15} tintColor="white" />
                        </Pressable>
                    ) : null}
                </View>
                {item.description ? (
                    <View style={styles.episodeDescription}>
                        <Text>{item.description}</Text>
                    </View>
                ) : null}
            </View>
        );
    };

    return (
        <FlatList data={tvSeason.episodes} renderItem={renderEpisode} contentContainerStyle={styles.episodeList} />
    );

}

const getStyles = (width: number, height: number) => StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: width / 8,
        marginBottom: height / 8,
    },
    centeredText: {
        textAlign: 'center',
    },
    episode: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    episodeBody: {
        width: '55%',
        padding: 10,
    },
    episodeDescription: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: 'lightgray',
    },
    episodeHeader: {
        flexDirection: 'row',
    },
    episodeImage: {
        width: '35%',
        aspectRatio: 16 / 9,
        backgroundColor: PlatformColor('systemGray3'),
    },
    episodeList: {
        margin: 10,
        paddingBottom: 50,
        gap: 10,
    },
    episodeName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    episodeStatus: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
