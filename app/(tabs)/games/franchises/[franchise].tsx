import { getFranchise } from '@/integration/giantBomb';
import { Game, GameFranchise, GameFranchiseItem, GameItem } from '@/models/games';
import { buildFranchise, gameStatusOptions, getGameDetail } from '@/util/games';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';

export default function FranchiseScreen() {

    const { franchise } = useLocalSearchParams<{ franchise: string }>();
    const savedFranchise = useQuery(GameFranchise).filtered('id == $0', franchise)[0];
    const realm = useRealm();
    const [ item, setItem ] = useState<GameFranchiseItem | GameFranchise | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        getFranchise(franchise)
        .then(data => {
            const item = buildFranchise(data);
            setItem(item);
            if (savedFranchise) {
                realm.write(() => {
                    realm.create(GameFranchise, item, Realm.UpdateMode.Modified);
                });
            }
        })
        .catch(error => {
            console.error(error);
            setItem(savedFranchise);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [franchise]);

    const savedGames = useQuery({
        type: Game,
        query: (collection) => {
            return collection.filtered('id IN $0', item?.games?.map(game => game.id) ?? []);
        }
    }, [item]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={styles.centered}>
                <Text style={styles.centeredText}>There was an error loading the details, please try again later</Text>
            </View>
        );
    }

    const footer = () => (
        <View style={styles.footer} />
    );

    const header = () => (
        <View>
            <Image source={item.imageUrl} style={styles.backdrop} contentFit="cover" />
            <View style={styles.header}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    const statusIcon = (game: GameItem | Game) => {
        const status = gameStatusOptions.find(option => option.value === savedGames.filtered('id == $0', game.id)[0]?.status);
        if (status) {
            return (
                <View style={{ ...styles.status, backgroundColor: status.color }}>
                    <SymbolView name={status.icon} tintColor="white" size={16} />
                </View>
            );
        }
        return null;
    };

    const renderItem = ({ item }: { item: GameItem | Game }) => (
        <Pressable style={styles.game} onPress={() => router.navigate(getGameDetail(item.id))}  >
            <Text numberOfLines={2} style={styles.title}>{item.title + '\n'}</Text>
            {statusIcon(item)}
        </Pressable>
    );

    return (
        <FlatList contentContainerStyle={styles.games} data={item.games} ListFooterComponent={footer} ListHeaderComponent={header} renderItem={renderItem} />
    );

}

const styles = StyleSheet.create({
    backdrop: {
        aspectRatio: 16 / 9,
        backgroundColor: PlatformColor('systemGray3'),
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 50,
    },
    centeredText: {
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
    },
    footer: {
        height: 100,
    },
    game: {
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        backgroundColor: 'white',
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    games: {
        gap: 10,
    },
    header: {
        flexDirection: 'column',
        gap: 10,
        margin: 20,
        marginBottom: 10,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    status: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontWeight: 'bold',
        margin: 10,
    },
});
