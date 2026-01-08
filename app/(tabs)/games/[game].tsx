import PartialList from '@/components/PartialList';
import Screen from '@/components/Screen';
import { Game, GameGenre, GameItem, GamePlatform, GamePlatformItem } from '@/models/games';
import { buildGame, gameStatusOptions, getGameDetail, openGameInBrowser } from '@/util/games';
import { getGame } from '@/integration/igdb';
import { Realm, useQuery } from '@realm/react';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';

export default function GameScreen() {

    const { game } = useLocalSearchParams<{ game: string }>();
    const savedPlatforms = useQuery(GamePlatform);

    const renderPlatform = (platform: GamePlatformItem | GamePlatform) => (
        <View key={platform.id} style={styles.section}>
            <Image source={platform.imageUrl ?? savedPlatforms.filtered('id == $0', platform.id)[0]?.imageUrl} style={styles.logo} contentFit="contain" />
            <Text numberOfLines={1} style={styles.name}>{platform.name}</Text>
        </View>
    );

    const additionalContent = (item: GameItem | Game) => (
        <View>
            { item.parentGame ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Parent Game</Text>
                    <PartialList<GameGenre, Game> partialItems={[ item.parentGame ]} mainSchema={Game} statusOptions={gameStatusOptions} getDetail={getGameDetail} />
                </View>
            ) : null}
            { item.dlcs?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>DLCs</Text>
                    <PartialList<GameGenre, Game> partialItems={item.dlcs} mainSchema={Game} statusOptions={gameStatusOptions} getDetail={getGameDetail} />
                </View>
            ) : null}
            { item.expansions?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Expansions</Text>
                    <PartialList<GameGenre, Game> partialItems={item.expansions} mainSchema={Game} statusOptions={gameStatusOptions} getDetail={getGameDetail} />
                </View>
            ) : null}
            { item.standaloneExpansions?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Standalone Expansions</Text>
                    <PartialList<GameGenre, Game> partialItems={item.standaloneExpansions} mainSchema={Game} statusOptions={gameStatusOptions} getDetail={getGameDetail} />
                </View>
            ) : null}
            { item.expandedGames?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Expanded Games</Text>
                    <PartialList<GameGenre, Game> partialItems={item.expandedGames} mainSchema={Game} statusOptions={gameStatusOptions} getDetail={getGameDetail} />
                </View>
            ) : null}
            { item.remasters?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Remasters</Text>
                    <PartialList<GameGenre, Game> partialItems={item.remasters} mainSchema={Game} statusOptions={gameStatusOptions} getDetail={getGameDetail} />
                </View>
            ) : null}
            { item.remakes?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Remakes</Text>
                    <PartialList<GameGenre, Game> partialItems={item.remakes} mainSchema={Game} statusOptions={gameStatusOptions} getDetail={getGameDetail} />
                </View>
            ) : null}
            { item.ports?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Ports</Text>
                    <PartialList<GameGenre, Game> partialItems={item.ports} mainSchema={Game} statusOptions={gameStatusOptions} getDetail={getGameDetail} />
                </View>
            ) : null}
            { item.platforms?.length ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Platforms</Text>
                    <View style={styles.sections}>
                        {item.platforms.map(renderPlatform)}
                    </View>
                </View>
            ) : null}
        </View>
    );

    return (
        <Screen<GameItem, GameGenre, Game> additionalContent={additionalContent} buildItem={buildGame} fetchData={getGame} id={game} openInBrowser={openGameInBrowser} schema={Game} statusOptions={gameStatusOptions} />
    );

}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        gap: 10,
    },
    logo: {
        width: '20%',
        aspectRatio: 2,
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
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    sections: {
        gap: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});
