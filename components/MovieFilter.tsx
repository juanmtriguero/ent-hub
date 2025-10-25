import GenreSelector from '@/components/GenreSelector';
import WatchProviderSelector from '@/components/WatchProviderSelector';
import { getMovieGenres, getMovieProviders } from '@/integration/tmdb';
import { MovieGenre, MovieProvider } from '@/models/movies';
import { getGenre } from '@/util/moviesAndTV';
import { useEffect, useState } from 'react';
import { PlatformColor, Pressable, StyleSheet, View, Text } from 'react-native';

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

    const [ selectedTypes, setSelectedTypes ] = useState<MovieFilterType[]>([]);
    const [ selectedProviders, setSelectedProviders ] = useState<string[]>([]);
    const [ selectedGenres, setSelectedGenres ] = useState<string[]>([]);

    useEffect(() => {
        onChange({
            types: selectedTypes,
            providers: selectedProviders,
            genres: selectedGenres,
        });
    }, [ selectedTypes, selectedProviders, selectedGenres ]);

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
                <WatchProviderSelector schema={MovieProvider} fetchData={getMovieProviders} onSelect={setSelectedProviders} />
            </View>
            <View style={styles.row}>
                <GenreSelector schema={MovieGenre} buildGenre={getGenre} fetchData={getMovieGenres} onSelect={setSelectedGenres} />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    horizontal: {
        flexDirection: 'row',
        gap: 5,
    },
    row: {
        marginTop: 10,
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
