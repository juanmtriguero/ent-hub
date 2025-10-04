import { Status } from '@/components/Screen';
import { Image } from 'expo-image';
import { Href, Link, useFocusEffect, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, PlatformColor, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const posterPlaceholder = require('@/assets/images/poster.png');

export type Tile = {
    detail: Href,
    id: string,
    posterUrl: string,
    releaseYear: string,
    title: string,
};

type Props = {
    getStatuses: (ids: string[]) => Promise<Map<string, Status>>,
    buildTile: (item: any) => Tile,
    fetchData: (page: number, params: any, signal: AbortSignal) => Promise<{ numPages: number, results: any[] }>,
    header?: { title: string, link: Href },
    limit?: number,
    params?: any,
};

export default function TileList({ getStatuses, buildTile, fetchData, header, limit, params }: Props) {

    const router = useRouter();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ numPages, setNumPages ] = useState<number>(0);
    const [ page, setPage ] = useState<number>(1);
    const [ tiles, setTiles ] = useState<Tile[]>([]);
    const [ statuses, setStatuses ] = useState<Map<string, Status>>(new Map());
    const { width } = useWindowDimensions();
    const numberOfColumns = Math.floor(width / 180);
    const styles = getStyles((width - 10 - (numberOfColumns * 10)) / numberOfColumns);

    let controller = new AbortController();

    const getTiles = (): Promise<Tile[]> => {
        setIsLoading(true);
        return fetchData(page, params, controller.signal)
        .then(({ numPages, results }) => {
            setNumPages(numPages);
            return results.map(buildTile);
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
            return [];
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const limitTiles = (tiles: Tile[]): Tile[] => {
        if (limit) {
            return tiles.slice(0, limit);
        }
        return tiles;
    };

    useEffect(() => {
        controller.abort();
        controller = new AbortController();
        getTiles().then(newTiles => {
            setTiles(limitTiles(newTiles));
        });
        setPage(1);
    }, [params]);

    useEffect(() => {
        if (page > 1) {
            getTiles().then(newTiles => {
                setTiles(limitTiles([ ...tiles, ...newTiles ]));
            });
        }
    }, [page]);

    useFocusEffect(useCallback(() => {
        getStatuses(tiles.map(tile => tile.id))
        .then(statuses => {
            setStatuses(statuses);
        })
        .catch(error => {
            console.error(error);
        });
    }, [tiles]));

    const statusIcon = (id: string) => {
        const status = statuses.get(id);
        if (status) {
            return (
                <View style={{ ...styles.status, backgroundColor: status.color }}>
                    <SymbolView name={status.icon} tintColor="white" size={ width / 20 } />
                </View>
            );
        }
        return null;
    };

    const renderTile = ({ item }: { item: Tile }) => {
        const navigateToDetail = () => {
            router.navigate(item.detail);
        };
        return (
            <Pressable onPress={navigateToDetail} style={styles.tile}>
                <Image source={item.posterUrl} style={styles.poster} contentFit="cover" placeholder={posterPlaceholder} placeholderContentFit="cover" />
                {statusIcon(item.id)}
                <View style={styles.titleContainer}>
                    <Text numberOfLines={2} style={styles.title}>{item.title + '\n'}</Text>
                    <Text>{item.releaseYear}</Text>
                </View>
            </Pressable>
        );
    };

    const renderNoData = () => {
        return isLoading ? null : (
            <View style={styles.centered}>
                <Text>No results found</Text>
            </View>
        );
    };

    const renderFooter = () => {
        return isLoading ? (
            <View style={styles.centered}>
                <ActivityIndicator />
            </View>
        ) : null;
    };

    const renderHeader = () => {
        return header ? (
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{header.title}</Text>
                <Link href={header.link}>
                    <Text style={styles.headerLink}>View all &gt;</Text>
                </Link>
            </View>
        ) : null;
    };

    const nextPage = () => {
        if (page < numPages && (!limit || tiles.length < limit)) {
            setPage(page + 1);
        }
    };

    return (
        <FlatList
            columnWrapperStyle={styles.columnWrapper}
            contentInsetAdjustmentBehavior="automatic"
            data={tiles}
            key={numberOfColumns}
            ListEmptyComponent={renderNoData}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader}
            numColumns={numberOfColumns}
            renderItem={renderTile}
            onEndReached={nextPage}
            style={styles.list}
        />
    );

}

const getStyles = (tileWidth: number) => StyleSheet.create({
    centered: {
        alignItems: 'center',
        marginTop: 40,
    },
    columnWrapper: {
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        marginVertical: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        marginBottom: 5,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    headerLink: {
        fontSize: 16,
        color: PlatformColor('systemBlue'),
    },
    list: {
        margin: 5,
        paddingVertical: 5,
    },
    poster: {
        height: tileWidth * 1.5,
    },
    status: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 100,
    },
    tile: {
        width: tileWidth,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'lightgray',
        overflow: 'hidden',
        marginHorizontal: 5,
    },
    title: {
        fontWeight: 'bold',
    },
    titleContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
});
