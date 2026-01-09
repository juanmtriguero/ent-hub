import GenreSelector from '@/components/GenreSelector';
import { getGameGenres, getGamePlatforms } from '@/integration/igdb';
import { GameGenre, GamePlatform, GamePlatformItem } from '@/models/games';
import { buildPlatform } from '@/util/games';
import { getGenre } from '@/util/moviesAndTV';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';

export type GameFilterParams = {
    platforms?: string[],
    genres?: string[],
};
    
export const buildGameQuery = (filter: GameFilterParams): { query: string[], queryParams: any[] } => {
    const query: string[] = [];
    const queryParams: any[] = [];
    if (filter.platforms?.length) {
        const orQuery: string[] = [];
        filter.platforms.forEach(platform => {
            orQuery.push(`platforms.id == $${queryParams.length}`);
            queryParams.push(platform);
        });
        query.push(`(${orQuery.join(' OR ')})`);
    }
    if (filter.genres?.length) {
        filter.genres.forEach(genre => {
            query.push(`genres.id == $${queryParams.length}`);
            queryParams.push(genre);
        });
    }
    return { query, queryParams };
}

type Props = {
    onChange: (filter: GameFilterParams) => void,
};

export default function GameFilter({ onChange }: Props) {

    const savedPlatforms = useQuery(GamePlatform).sorted('releaseDate', true);
    const realm = useRealm();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ numPages, setNumPages ] = useState<number>(0);
    const [ page, setPage ] = useState<number>(1);
    const [ platforms, setPlatforms ] = useState<GamePlatformItem[]>([]);
    const [ selectedPlatforms, setSelectedPlatforms ] = useState<string[]>([]);
    const [ selectedGenres, setSelectedGenres ] = useState<string[]>([]);

    useEffect(() => {
        setIsLoading(true);
        getGamePlatforms(page)
        .then(({ numPages, results }) => {
            setNumPages(numPages);
            const newPlatforms = results.map(buildPlatform);
            realm.write(() => {
                newPlatforms.forEach(platform => {
                    realm.create(GamePlatform, platform, Realm.UpdateMode.Modified);
                });
            });
            setPlatforms([ ...platforms, ...newPlatforms ]);
        })
        .catch(error => {
            console.error(error);
            setPlatforms([ ...savedPlatforms ]);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [page]);

    useEffect(() => {
        onChange({
            platforms: selectedPlatforms,
            genres: selectedGenres,
        });
    }, [ selectedPlatforms, selectedGenres ]);

    const displayPlatform = ({ item }: { item: GamePlatformItem }) => {
        const selectPlatform = () => {
            if (selectedPlatforms.includes(item.id)) {
                setSelectedPlatforms(selectedPlatforms.filter(platform => platform !== item.id));
            } else {
                setSelectedPlatforms([ ...selectedPlatforms, item.id ]);
            }
        };
        return (
            <Pressable key={item.id} onPress={selectPlatform} style={styles.platform}>
                { selectedPlatforms.includes(item.id) && <View style={styles.cover} /> }
                <Image source={item.imageUrl} style={styles.logo} contentFit="contain" />
                <Text style={styles.short} numberOfLines={1}>{item.short}</Text>
            </Pressable>
        );
    };

    const renderFooter = () => {
        return isLoading ? (
            <View style={styles.loading}>
                <ActivityIndicator />
            </View>
        ) : null;
    };

    const nextPage = () => {
        if (page < numPages) {
            setPage(page + 1);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <FlatList data={platforms} renderItem={displayPlatform} contentContainerStyle={styles.list} horizontal onEndReached={nextPage} ListFooterComponent={renderFooter} showsHorizontalScrollIndicator={false} />
            </View>
            <View style={styles.row}>
                <GenreSelector schema={GameGenre} buildGenre={getGenre} fetchData={getGameGenres} onSelect={setSelectedGenres} />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    cover: {
        position: 'absolute',
        backgroundColor: PlatformColor('systemBlue'),
        opacity: 0.5,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        zIndex: 1,
    },
    list: {
        gap: 7,
    },
    loading: {
        height: 80,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        aspectRatio: 2,
        width: 80,
        marginTop: 10,
    },
    platform: {
        width: 100,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        overflow: 'hidden',
        backgroundColor: 'white',
        alignItems: 'center',
        gap: 5,
    },
    row: {
        marginTop: 10,
    },
    short: {
        padding: 5,
        textAlign: 'center',
    },
});
