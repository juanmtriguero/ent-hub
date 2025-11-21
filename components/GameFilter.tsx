import GenreSelector from '@/components/GenreSelector';
import { getGameGenres, getGamePlatforms } from '@/integration/giantBomb';
import { GameGenre, GamePlatform, GamePlatformItem } from '@/models/games';
import { buildPlatform } from '@/util/games';
import { getGenre } from '@/util/moviesAndTV';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';

export type GameFilterParams = {
    platform?: string,
    genres?: string[],
};
    
export const buildGameQuery = (filter: GameFilterParams): { query: string[], queryParams: any[] } => {
    const query: string[] = [];
    const queryParams: any[] = [];
    if (filter.platform) {
        query.push(`platforms.id == $${queryParams.length}`);
        queryParams.push(filter.platform);
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
    includeGenres?: boolean,
};

export default function GameFilter({ onChange, includeGenres = true }: Props) {

    const savedPlatforms = useQuery(GamePlatform).sorted('releaseDate', true);
    const realm = useRealm();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ numPages, setNumPages ] = useState<number>(0);
    const [ page, setPage ] = useState<number>(1);
    const [ platforms, setPlatforms ] = useState<GamePlatformItem[]>([]);
    const [ selectedPlatform, setSelectedPlatform ] = useState<string | undefined>(undefined);
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
            platform: selectedPlatform,
            genres: selectedGenres,
        });
    }, [ selectedPlatform, selectedGenres ]);

    const displayPlatform = ({ item }: { item: GamePlatformItem }) => {
        const selectPlatform = () => {
            if (selectedPlatform === item.id) {
                setSelectedPlatform(undefined);
            } else {
                setSelectedPlatform(item.id);
            }
        };
        return (
            <Pressable key={item.id} onPress={selectPlatform} style={styles.platform}>
                { selectedPlatform === item.id && <View style={styles.cover} /> }
                <Image source={item.imageUrl} style={styles.logo} />
                <Text style={styles.short}>{item.short}</Text>
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
            { includeGenres ? (
                <View style={styles.row}>
                    <GenreSelector schema={GameGenre} buildGenre={getGenre} fetchData={getGameGenres} onSelect={setSelectedGenres} />
                </View>
            ) : null}
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
        height: 96,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        aspectRatio: 1,
    },
    platform: {
        width: 70,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    row: {
        marginTop: 10,
    },
    short: {
        padding: 5,
        textAlign: 'center',
    },
});
