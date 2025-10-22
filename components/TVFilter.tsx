import GenreSelector from '@/components/GenreSelector';
import { getTVGenres, getTVProviders } from '@/integration/tmdb';
import { WatchProvider } from '@/models/interfaces';
import { TVGenre, TVProvider } from '@/models/tv';
import { getGenre, getWatchProvider } from '@/util/moviesAndTV';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { FlatList, PlatformColor, Pressable, StyleSheet, View, Text } from 'react-native';

export type TVFilterParams = {
    providers?: string[],
    genres?: string[],
};
    
export const buildTVQuery = (filter: TVFilterParams): { query: string[], queryParams: any[] } => {
    const query: string[] = [];
    const queryParams: any[] = [];
    if (filter.providers?.length) {
        const orQuery: string[] = [];
        filter.providers.forEach(provider => {
            orQuery.push(`flatrate.id == $${queryParams.length}`);
            queryParams.push(provider);
        });
        query.push(`(${orQuery.join(' OR ')})`);
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
    onChange: (filter: TVFilterParams) => void,
};

export default function TVFilter({ onChange }: Props) {

    const savedProviders = useQuery(TVProvider).sorted('priority', true);
    const realm = useRealm();
    const [ providers, setProviders ] = useState<WatchProvider[]>([]);
    const [ selectedProviders, setSelectedProviders ] = useState<string[]>([]);
    const [ selectedGenres, setSelectedGenres ] = useState<string[]>([]);

    useEffect(() => {
        getTVProviders()
        .then(data => {
            setProviders(data.map(getWatchProvider).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)));
            realm.write(() => {
                providers.forEach(provider => {
                    realm.create(TVProvider, { ...provider }, Realm.UpdateMode.Modified);
                });
            });
        })
        .catch(error => {
            console.error(error);
            setProviders([ ...savedProviders ]);
        });
    }, []);

    useEffect(() => {
        onChange({
            providers: selectedProviders,
            genres: selectedGenres,
        });
    }, [ selectedProviders, selectedGenres ]);

    const displayProvider = ({ item }: { item: WatchProvider }) => {
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
        <View style={styles.container}>
            <View style={styles.row}>
                <FlatList data={providers} renderItem={displayProvider} contentContainerStyle={styles.separator} horizontal showsHorizontalScrollIndicator={false} />
            </View>
            <View style={styles.row}>
                <GenreSelector schema={TVGenre} buildGenre={getGenre} fetchData={getTVGenres} onSelect={setSelectedGenres} />
            </View>
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
    horizontal: {
        flexDirection: 'row',
        gap: 5,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        overflow: 'hidden',
    },
    row: {
        marginTop: 10,
    },
    separator: {
        gap: 5,
    },
    selectedType: {
        color: 'white',
        backgroundColor: PlatformColor('systemBlue'),
    },
    type: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 5,
        backgroundColor: 'white',
        textAlign: 'center',
    },
});
