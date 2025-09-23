import { Image } from 'expo-image';
import { Href, Link, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, PlatformColor, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

export type Tile = {
    detail: Href,
    posterUrl: string,
    releaseYear: string,
    title: string,
};

type Props = {
    data: Tile[],
    isLoading?: boolean,
    header?: {
        title: string,
        link: Href,
    },
};

const { width } = useWindowDimensions();
const numberOfColumns = Math.floor(width / 180);
const tileWidth = (width - 10 - (numberOfColumns * 10)) / numberOfColumns;
const posterHeight = tileWidth * 1.5;

export default function TileList({ data, isLoading = false, header }: Props) {

    const router = useRouter();

    const renderTile = ({ item }: { item: Tile }) => {
        const navigateToDetail = () => {
            router.navigate(item.detail);
        };
        return (
            <Pressable onPress={navigateToDetail} style={styles.tile}>
                <Image source={item.posterUrl} style={styles.poster} contentFit="cover" />
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

    return (
        <FlatList
            columnWrapperStyle={styles.columnWrapper}
            contentInsetAdjustmentBehavior="automatic"
            data={data}
            key={numberOfColumns}
            ListEmptyComponent={renderNoData}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader}
            numColumns={numberOfColumns}
            renderItem={renderTile}
            style={styles.list}
        />
    );

}

const styles = StyleSheet.create({
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
        height: posterHeight,
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
