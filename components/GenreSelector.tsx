import { Genre } from '@/models/interfaces';
import { Realm, useQuery, useRealm } from '@realm/react';
import { useEffect, useState } from 'react';
import { FlatList, PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    schema: Realm.ObjectClass<Genre & Realm.Object>,
    buildGenre: (genre: any) => Genre,
    fetchData: () => Promise<Genre[]>,
    onSelect: (genres: string[]) => void,
};

export default function GenreSelector({ schema, buildGenre, fetchData, onSelect }: Props) {

    const savedGenres = useQuery(schema);
    const realm = useRealm();
    const [ genres, setGenres ] = useState<Genre[]>([]);
    const [ selectedGenres, setSelectedGenres ] = useState<string[]>([]);

    useEffect(() => {
        fetchData()
        .then(data => {
            const genres = data.map(buildGenre);
            setGenres(genres);
            realm.write(() => {
                genres.forEach(genre => {
                    realm.create(schema, genre, Realm.UpdateMode.Modified);
                });
            });
        })
        .catch(error => {
            console.error(error);
            setGenres([ ...savedGenres ]);
        });
    }, []);

    useEffect(() => {
        onSelect(selectedGenres);
    }, [ selectedGenres ]);

    const displayGenre = ({ item }: { item: Genre }) => {
        const selectGenre = () => {
            if (selectedGenres.includes(item.id)) {
                setSelectedGenres(selectedGenres.filter(genre => genre !== item.id));
            } else {
                setSelectedGenres([ ...selectedGenres, item.id ]);
            }
        };
        const genreStyle = { ...styles.genre };
        if (selectedGenres.includes(item.id)) {
            Object.assign(genreStyle, styles.selectedGenre);
        }
        return (
            <Pressable key={item.id} onPress={selectGenre}>
                <Text style={genreStyle}>{item.name}</Text>
            </Pressable>
        );
    };

    return (
        <FlatList data={genres} renderItem={displayGenre} contentContainerStyle={styles.separator} horizontal showsHorizontalScrollIndicator={false} />
    );

}

const styles = StyleSheet.create({
    genre: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 5,
        backgroundColor: 'white',
    },
    selectedGenre: {
        color: 'white',
        backgroundColor: PlatformColor('systemBlue'),
    },
    separator: {
        gap: 5,
    },
});
