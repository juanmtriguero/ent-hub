import { SavedProvider, WatchProvider } from '@/models/interfaces';
import { getWatchProvider } from '@/util/moviesAndTV';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';

type Props = {
    schema: Realm.RealmObjectConstructor<SavedProvider & Realm.Object>,
    fetchData: () => Promise<WatchProvider[]>,
};

export default function MyWatchProviders({ schema, fetchData }: Props) {

    const providers = useQuery(schema).sorted('priority');
    const realm = useRealm();

    useEffect(() => {
        fetchData()
        .then(data => {
            realm.write(() => {
                data.map(getWatchProvider).forEach(provider => {
                    realm.create(schema, provider, Realm.UpdateMode.Modified);
                });
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    const renderProvider = ({ item }: { item: SavedProvider }) => {
        return (
            <View key={item.id} style={styles.section}>
                <Image source={item.logoUrl} style={styles.logo} contentFit="cover" />
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
        <FlatList data={providers} renderItem={renderProvider} contentContainerStyle={styles.list} />
    );

}

const styles = StyleSheet.create({
    list: {
        gap: 5,
        padding: 10,
        paddingBottom: 35,
    },
    logo: {
        width: '15%',
        aspectRatio: 1,
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
    },
    switch: {
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 10,
    },
});
