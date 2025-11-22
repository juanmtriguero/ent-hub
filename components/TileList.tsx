import { Status } from '@/components/Screen';
import { Image } from 'expo-image';
import { Href, Link, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef } from 'react';
import { ActivityIndicator, FlatList, PlatformColor, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const posterPlaceholder = require('@/assets/images/poster.png');

export type Tile = {
    detail: Href,
    id: string,
    posterUrl?: string,
    releaseYear: string,
    title: string,
    status?: string,
};

type Props = {
    tiles: Tile[],
    statusOptions: Status[],
    isLoading: boolean,
    getStatus: (item: Tile) => string | undefined,
    nextPage?: () => void,
    header?: { title: string, link: Href },
};

export default function TileList({ tiles, statusOptions, isLoading, getStatus, nextPage, header }: Props) {

    const allowPagination = useRef(true);
    const router = useRouter();
    const { width } = useWindowDimensions();
    const numberOfColumns = Math.floor(width / 180);
    const styles = getStyles((width - 10 - (numberOfColumns * 10)) / numberOfColumns);

    const statusIcon = (item: Tile) => {
        const status = statusOptions.find(option => option.value === getStatus(item));
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
                {statusIcon(item)}
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

    const handleEndReached = () => {
        if (nextPage && !isLoading && allowPagination.current) {
            allowPagination.current = false;
            nextPage();
        }
    };

    const handleScrollBegin = () => {
        allowPagination.current = true;
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
            onEndReached={handleEndReached}
            onMomentumScrollBegin={handleScrollBegin}
            style={styles.list}
        />
    );

}

const getStyles = (tileWidth: number) => StyleSheet.create({
    centered: {
        alignItems: 'center',
        marginVertical: 40,
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
        borderRadius: '100%',
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
