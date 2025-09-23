import TileList, { Tile } from '@/components/TileList';
import { useNavigation, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { PlatformColor, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
    homeView: React.ReactNode;
    searchFunction: (text: string, signal: AbortSignal) => Promise<Tile[]>;
    searchOn: string;
    title: string;
};

export default function Index({ homeView, searchFunction, searchOn, title }: Props) {

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

    return searchText.length ? searchView : homeView;

}

const styles = StyleSheet.create({
    logo: {
        fontWeight: 'bold',
        color: PlatformColor('systemBlue'),
    },
});
