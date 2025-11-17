import { SavedProvider, WatchProvider } from '@/models/interfaces';
import { getWatchProvider } from '@/util/moviesAndTV';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Button, FlatList, PlatformColor, Pressable, StyleSheet, View } from 'react-native';

type Props = {
    schema: Realm.ObjectClass<SavedProvider & Realm.Object>,
    fetchData: () => Promise<WatchProvider[]>,
    onSelect: (providers: string[]) => void,
};

export default function WatchProviderSelector({ schema, fetchData, onSelect }: Props) {

    const savedProviders = useQuery(schema).sorted('priority', true);
    const realm = useRealm();
    const [ providers, setProviders ] = useState<WatchProvider[]>([]);
    const [ selectedProviders, setSelectedProviders ] = useState<string[]>([]);

    useEffect(() => {
        fetchData()
        .then(data => {
            const providers = data.map(getWatchProvider).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
            setProviders(providers);
            realm.write(() => {
                providers.forEach(provider => {
                    realm.create(schema, provider, Realm.UpdateMode.Modified);
                });
            });
        })
        .catch(error => {
            console.error(error);
            setProviders([ ...savedProviders ]);
        });
    }, []);

    useEffect(() => {
        onSelect(selectedProviders);
    }, [ selectedProviders ]);

    const selectMyServices = () => {
        setSelectedProviders(savedProviders.filtered('mine == true').map(provider => provider.id));
    };

    const updateMyServices = () => {
        realm.write(() => {
            savedProviders.forEach(provider => {
                provider.mine = selectedProviders.includes(provider.id);
            });
        });
        alert('Your services have been updated');
    };

    const displayProvider = ({ item }: { item: WatchProvider | 'action' }) => {
        if (item === 'action') {
            const { title, action } = selectedProviders.length ? { title: 'Update my\nservices', action: updateMyServices } : { title: 'Select my\nservices', action: selectMyServices };
            return (
                <Button title={title} onPress={action} />
            );
        }
        const selectProvider = () => {
            if (selectedProviders.includes(item.id)) {
                setSelectedProviders(selectedProviders.filter(provider => provider !== item.id));
            } else {
                setSelectedProviders([ ...selectedProviders, item.id ]);
            }
        };
        return (
            <Pressable key={item.id} onPress={selectProvider}>
                { selectedProviders.includes(item.id) && <View style={styles.cover} /> }
                <Image source={item.logoUrl} style={styles.logo} />
            </Pressable>
        );
    };

    return (
        <FlatList data={[ 'action', ...providers ]} renderItem={displayProvider} contentContainerStyle={styles.list} horizontal showsHorizontalScrollIndicator={false} />
    );

}

const styles = StyleSheet.create({
    cover: {
        position: 'absolute',
        backgroundColor: PlatformColor('systemBlue'),
        opacity: 0.5,
        width: '100%',
        height: '100%',
        borderRadius: 15,
        zIndex: 1,
    },
    list: {
        alignItems: 'center',
        gap: 5,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'lightgray',
        overflow: 'hidden',
    },
});
