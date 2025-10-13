import GenreSelector from '@/components/GenreSelector';
import { getGenres, getMovieProviders } from '@/integration/tmdb';
import { WatchProvider } from '@/models/interfaces';
import { MovieGenre, MovieProvider } from '@/models/movies';
import { getMovieGenre, getMovieProvider } from '@/util/movies';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { FlatList, PlatformColor, Pressable, StyleSheet, View, Text } from 'react-native';

enum MovieFilterType {
    Ads = 'ads',
    Flatrate = 'flatrate',
    Rent = 'rent',
    Buy = 'buy',
}

export type MovieFilterParams = {
    types?: MovieFilterType[],
    providers?: string[],
    genres?: string[],
};

export const buildMovieQuery = (filter: MovieFilterParams): { query: string[], queryParams: any[] } => {
    const query: string[] = [];
    const queryParams: any[] = [];
    if (filter.providers?.length) {
        const orQuery: string[] = [];
        const types = filter.types?.length ? filter.types : Object.values(MovieFilterType);
        filter.providers.forEach(provider => {
            types.forEach(type => {
                orQuery.push(`${type}.id == $${queryParams.length}`);
            });
            queryParams.push(provider);
        });
        query.push(`(${orQuery.join(' OR ')})`);
    } else if (filter.types?.length) {
        query.push(`(${filter.types.map(type => `${type}.@count > 0`).join(' OR ')})`);
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
    onChange: (filter: MovieFilterParams) => void,
};

export default function MovieFilter({ onChange }: Props) {

    const savedProviders = useQuery(MovieProvider).sorted('priority', true);
    const realm = useRealm();
    const [ providers, setProviders ] = useState<WatchProvider[]>([]);
    const [ selectedTypes, setSelectedTypes ] = useState<MovieFilterType[]>([]);
    const [ selectedProviders, setSelectedProviders ] = useState<string[]>([]);
    const [ selectedGenres, setSelectedGenres ] = useState<string[]>([]);

    useEffect(() => {
        getMovieProviders()
        .then(data => {
            setProviders(data.map(getMovieProvider).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)));
            realm.write(() => {
                providers.forEach(provider => {
                    realm.create(MovieProvider, { ...provider }, Realm.UpdateMode.Modified);
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
            types: selectedTypes,
            providers: selectedProviders,
            genres: selectedGenres,
        });
    }, [ selectedTypes, selectedProviders, selectedGenres ]);

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

    const displayType = ({ item, label }: { item: MovieFilterType, label: string }) => {
        const selectType = () => {
            if (selectedTypes.includes(item)) {
                setSelectedTypes(selectedTypes.filter(type => type !== item));
            } else {
                setSelectedTypes([ ...selectedTypes, item ]);
            }
        };
        const typeStyle = { ...styles.type };
        if (selectedTypes.includes(item)) {
            Object.assign(typeStyle, styles.selectedType);
        }
        return (
            <Pressable key={item} onPress={selectType} style={{ flex: 1 }}>
                <Text numberOfLines={1} style={typeStyle}>{label}</Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.horizontal}>
                    { displayType({ item: MovieFilterType.Ads, label: 'Free (ads)' }) }
                    { displayType({ item: MovieFilterType.Flatrate, label: 'Streaming' }) }
                    { displayType({ item: MovieFilterType.Rent, label: 'Rent' }) }
                    { displayType({ item: MovieFilterType.Buy, label: 'Buy' }) }
                </View>
            </View>
            <View style={styles.row}>
                <FlatList data={providers} renderItem={displayProvider} contentContainerStyle={styles.separator} horizontal showsHorizontalScrollIndicator={false} />
            </View>
            <View style={styles.row}>
                <GenreSelector schema={MovieGenre} buildGenre={getMovieGenre} fetchData={getGenres} onSelect={setSelectedGenres} />
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
