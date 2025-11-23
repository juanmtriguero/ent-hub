import Screen from '@/components/Screen';
import { Game, GameFranchise, GameFranchiseItem, GameGenre, GameItem, GamePlatform, GamePlatformItem } from '@/models/games';
import { buildGame, gameStatusOptions, openGameInBrowser } from '@/util/games';
import { getGame } from '@/integration/giantBomb';
import { Realm, useQuery } from '@realm/react';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';

export default function GameScreen() {

    const { game } = useLocalSearchParams<{ game: string }>();
    const savedPlatforms = useQuery(GamePlatform);
    const savedFranchises = useQuery(GameFranchise);

    const renderPlatform = (platform: GamePlatformItem | GamePlatform) => (
        <View key={platform.id} style={styles.section}>
            <Image source={platform.imageUrl ?? savedPlatforms.filtered('id == $0', platform.id)[0]?.imageUrl} style={styles.logo} contentFit="cover" />
            <Text numberOfLines={1} style={styles.name}>{platform.name}</Text>
        </View>
    );

    const navigateToFranchise = (franchise: string) => {
        router.navigate({
            pathname: '/games/franchises/[franchise]',
            params: { franchise },
        });
    };

    const renderFranchise = (franchise: GameFranchiseItem | GameFranchise) => (
        <Pressable key={franchise.id} onPress={() => navigateToFranchise(franchise.id)} style={styles.section}>
            <Image source={franchise.imageUrl ?? savedFranchises.filtered('id == $0', franchise.id)[0]?.imageUrl} style={styles.image} contentFit="cover" />
            <Text numberOfLines={1} style={styles.name}>{franchise.name}</Text>
        </Pressable>
    );

    const additionalContent = (item: GameItem | Game) => (
        <View>
            { item.platforms?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Platforms</Text>
                    <View style={styles.sections}>
                        {item.platforms.map(renderPlatform)}
                    </View>
                </View>
            ) : null}
            { item.franchises?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Franchises</Text>
                    <View style={styles.sections}>
                        {item.franchises.map(renderFranchise)}
                    </View>
                </View>
            ) : null}
        </View>
    );

    const deleteOrphans = (realm: Realm) => {
        realm.delete(realm.objects('GameFranchise').filtered('games.@count == 0'));
    };

    return (
        <Screen<GameItem, GameGenre, Game> additionalContent={additionalContent} buildItem={buildGame} fetchData={getGame} id={game} openInBrowser={openGameInBrowser} schema={Game} statusOptions={gameStatusOptions} deleteOrphans={deleteOrphans} />
    );

}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        gap: 10,
    },
    image: {
        width: '25%',
        aspectRatio: 16 / 9,
        backgroundColor: PlatformColor('systemGray3'),
    },
    logo: {
        width: '15%',
        aspectRatio: 1,
        backgroundColor: PlatformColor('systemGray3'),
    },
    name: {
        flex: 1,
        fontSize: 16,
        padding: 5,
    },
    section: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    sections: {
        gap: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});
