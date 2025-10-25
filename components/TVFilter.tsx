import GenreSelector from '@/components/GenreSelector';
import WatchProviderSelector from '@/components/WatchProviderSelector';
import { getTVGenres, getTVProviders } from '@/integration/tmdb';
import { TVGenre, TVProvider } from '@/models/tv';
import { getGenre } from '@/util/moviesAndTV';
import { useEffect, useState } from 'react';
import { PlatformColor, StyleSheet, View } from 'react-native';

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

    const [ selectedProviders, setSelectedProviders ] = useState<string[]>([]);
    const [ selectedGenres, setSelectedGenres ] = useState<string[]>([]);

    useEffect(() => {
        onChange({
            providers: selectedProviders,
            genres: selectedGenres,
        });
    }, [ selectedProviders, selectedGenres ]);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <WatchProviderSelector schema={TVProvider} fetchData={getTVProviders} onSelect={setSelectedProviders} />
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
