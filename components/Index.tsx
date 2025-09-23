import TileList, { Tile } from '@/components/TileList';
import { Href, useNavigation, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { FlatList, PlatformColor, Pressable, StyleSheet, Text } from 'react-native';

export type Section = {
    tiles: Tile[];
    title: string;
    viewAll: Href;
};

type Props = {
    searchFunction: (text: string, signal: AbortSignal) => Promise<Tile[]>;
    searchOn: string;
    sections: Section[];
    title: string;
};

export default function Index({ searchFunction, searchOn, sections, title }: Props) {

    const navigation = useNavigation();
    const router = useRouter();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ searchResults, setSearchResults ] = useState<Tile[]>([]);
    const [ searchText, setSearchText ] = useState<string>('');

    useEffect(() => {
        navigation.setOptions({
            headerLargeTitle: true,
            headerLeft: () => logo,
            headerRight: () => settings,
            headerSearchBarOptions: {
                onChangeText: (event: any) => search(event.nativeEvent.text),
                placeholder: `Search on ${searchOn}`,
            },
            title: title,
        });
    }, [navigation]);

    const logo = (
        <Text style={styles.logo}>EntHub</Text>
    );

    const settings = (
        <Pressable onPress={() => router.navigate('/settings')}>
            <SymbolView name="gear" size={30} />
        </Pressable>
    );

    let controller: AbortController;
    const search = (text: string) => {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();
        setSearchText(text);
        if (text.length) {
            setIsLoading(true);
            searchFunction(text, controller.signal)
            .then((results) => {
                setSearchResults(results);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error(error);
                    setSearchResults([]);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
        } else {
            setSearchResults([]);
        }
    };

    const searchView = (
        <TileList data={searchResults} isLoading={isLoading} />
    );

    const homeView = (
        <FlatList
            contentInsetAdjustmentBehavior="automatic"
            data={sections}
            renderItem={({ item }: { item: Section }) => (
                <TileList data={item.tiles} header={{ title: item.title, link: item.viewAll }} />
            )}
        />
    );

    return searchText.length ? searchView : homeView;

}

const styles = StyleSheet.create({
    logo: {
        fontWeight: 'bold',
        color: PlatformColor('systemBlue'),
    },
});
