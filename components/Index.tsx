import FetchList from '@/components/FetchList';
import QueryList from '@/components/QueryList';
import { Status } from '@/components/Screen';
import Stats from '@/components/Stats';
import { Tile } from '@/components/TileList';
import { SavedItem } from '@/models/interfaces';
import { Realm } from '@realm/react';
import { Href, useNavigation, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { FlatList, PlatformColor, Pressable, StyleSheet, Text, View } from 'react-native';

type Section = {
    title: string;
    viewAll: Href;
    limit?: number;
};

export type FetchSection = {
    fetchData: (page: number, params: any, signal: AbortSignal) => Promise<{ numPages: number, results: any[] }>;
} & Section;

export type QuerySection = {
    query: string;
    queryParams: any[];
    getDetail: (id: string) => Href;
} & Section;

type Props = {
    buildTile: (item: any) => Tile;
    schema: Realm.ObjectClass<SavedItem & Realm.Object>,
    searchData: (page: number, params: any, signal: AbortSignal) => Promise<{ numPages: number, results: any[] }>;
    searchOn: string;
    sections: (FetchSection | QuerySection)[];
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
        <FetchList schema={schema} statusOptions={statusOptions} buildTile={buildTile} fetchData={searchData} params={searchParams} />
    );

    const isFetchSection = (section: FetchSection | QuerySection): section is FetchSection => 'fetchData' in section;

    const homeView = (
        <View>
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={[ ...sections, 'stats' ]}
                renderItem={({ item }: { item: FetchSection | QuerySection | 'stats' }) => {
                    if (item === 'stats') {
                        return (
                            <Stats schema={schema} statusOptions={statusOptions} />
                        );
                    }
                    const header = { title: item.title, link: item.viewAll };
                    if (isFetchSection(item)) {
                        return (
                            <FetchList buildTile={buildTile} fetchData={item.fetchData} schema={schema} statusOptions={statusOptions} header={header} limit={item.limit} />
                        );
                    }
                    return (
                        <QueryList query={item.query} queryParams={item.queryParams} getDetail={item.getDetail} schema={schema} statusOptions={statusOptions} header={header} limit={item.limit} />
                    );
                }}
            />
        </View>
    );

    return searchText.length ? searchView : homeView;

}

const styles = StyleSheet.create({
    logo: {
        fontWeight: 'bold',
        color: PlatformColor('systemBlue'),
    },
});
