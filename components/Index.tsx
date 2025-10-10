import { Status } from '@/components/Screen';
import TileList, { Tile } from '@/components/TileList';
import { Href, useNavigation, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { FlatList, PlatformColor, Pressable, StyleSheet, Text } from 'react-native';

export type Section = {
    fetchData: (page: number, params: any, signal: AbortSignal) => Promise<{ numPages: number, results: any[] }>,
    limit?: number,
    title: string;
    viewAll: Href;
};

type Props = {
    buildTile: (item: any) => Tile;
    schema: Realm.ObjectClass<{ id: string, status: string } & Realm.Object>;
    searchData: (page: number, params: any, signal: AbortSignal) => Promise<{ numPages: number, results: any[] }>;
    searchOn: string;
    sections: Section[];
    statusOptions: Status[];
};

export default function Index({ buildTile, schema, searchData, searchOn, sections, statusOptions }: Props) {

    const navigation = useNavigation();
    const router = useRouter();
    const [ searchText, setSearchText ] = useState<string>('');
    const [ searchParams, setSearchParams ] = useState<any>({});

    useEffect(() => {
        setSearchParams({
            text: searchText,
        });
    }, [searchText]);

    useEffect(() => {
        navigation.setOptions({
            headerLargeTitle: true,
            headerLeft: () => logo,
            headerRight: () => settings,
            headerSearchBarOptions: {
                onChangeText: (event: any) => setSearchText(event.nativeEvent.text),
                placeholder: `Search on ${searchOn}`,
            },
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

    const searchView = (
        <TileList schema={schema} statusOptions={statusOptions} buildTile={buildTile} fetchData={searchData} params={searchParams} />
    );

    const homeView = (
        <FlatList
            contentInsetAdjustmentBehavior="automatic"
            data={sections}
            renderItem={({ item }: { item: Section }) => (
                <TileList schema={schema} statusOptions={statusOptions} buildTile={buildTile} fetchData={item.fetchData} header={{ title: item.title, link: item.viewAll }} limit={item.limit} />
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
