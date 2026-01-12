import { getGamePlatforms } from '@/integration/igdb';
import { GamePlatform } from '@/models/games';
import { buildPlatform } from '@/util/games';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';

export default function GamesPlatforms() {

    const platforms = useQuery(GamePlatform).sorted('releaseDate', true);
    const realm = useRealm();

    useEffect(() => {
        getGamePlatforms()
        .then(data => {
            realm.write(() => {
                data.map(buildPlatform).forEach(platform => {
                    realm.create(GamePlatform, platform, Realm.UpdateMode.Modified);
                });
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    const renderPlatform = ({ item }: { item: GamePlatform }) => {
        return (
            <View key={item.id} style={styles.section}>
                <Image source={item.imageUrl} style={styles.logo} contentFit="contain" />
                <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
                <Switch onValueChange={checked => {
                    realm.write(() => {
                        item.mine = checked;
                    });
                }} value={item.mine} style={styles.switch} />
            </View>
        );
    };

    return (
        <FlatList data={platforms} renderItem={renderPlatform} contentContainerStyle={styles.list} />
    );

}

const styles = StyleSheet.create({
    list: {
        gap: 5,
        padding: 10,
        paddingBottom: 35,
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
    switch: {
        alignSelf: 'center',
        marginLeft: 'auto',
    },
});
