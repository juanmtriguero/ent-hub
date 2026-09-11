import GenreSelector from '@/components/GenreSelector';
import { getBookGenres } from '@/integration/openLibrary';
import { BookGenre } from '@/models/books';
import { getGenre } from '@/util/books';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export type BookFilterParams = {
    genres?: string[],
};

export const buildBookQuery = (filter: BookFilterParams): { query: string[], queryParams: any[] } => {
    const query: string[] = [];
    const queryParams: any[] = [];
    if (filter.genres?.length) {
        filter.genres.forEach(genre => {
            query.push(`genres.id == $${queryParams.length}`);
            queryParams.push(genre);
        });
    }
    return { query, queryParams };
}

type Props = {
    onChange: (filter: BookFilterParams) => void,
};

export default function BookFilter({ onChange }: Props) {

    const [ selectedGenres, setSelectedGenres ] = useState<string[]>([]);

    useEffect(() => {
        onChange({
            genres: selectedGenres,
        });
    }, [ selectedGenres ]);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <GenreSelector schema={BookGenre} buildGenre={getGenre} fetchData={getBookGenres} onSelect={setSelectedGenres} />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    row: {
        marginTop: 10,
    },
});
