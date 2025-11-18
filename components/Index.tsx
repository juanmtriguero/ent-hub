import FetchList from '@/components/FetchList';
import QueryList from '@/components/QueryList';
import { Status } from '@/components/Screen';
import Stats from '@/components/Stats';
import { Tile } from '@/components/TileList';
import { Genre, SavedItem } from '@/models/interfaces';
import { Realm } from '@realm/react';
import { Href, useNavigation, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { isValidElement, ReactElement, useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

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

type Props<G extends Genre, S extends SavedItem<G> & Realm.Object> = {
    buildTile: (item: any) => Tile;
    schema: Realm.ObjectClass<S>,
    searchData: (page: number, params: any, signal: AbortSignal) => Promise<{ numPages: number, results: any[] }>;
    searchOn: string;
    sections: (ReactElement | FetchSection | QuerySection)[];
    statusOptions: Status[];
};

export default function Index<G extends Genre, S extends SavedItem<G> & Realm.Object>({ buildTile, schema, searchData, searchOn, sections, statusOptions }: Props<G, S>) {

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
            // FIXME: set to true when Apple fixes the bug
            headerLargeTitle: false,
            headerRight: () => settings,
            headerSearchBarOptions: {
                onChangeText: (event: any) => setSearchText(event.nativeEvent.text),
                placeholder: `Search on ${searchOn}`,
            },
        });
    }, [navigation]);

    const settings = (
        <Pressable onPress={() => router.navigate('/settings')}>
            <SymbolView name="gear" size={36} />
        </Pressable>
    );

    const searchView = (
        <FetchList<G, S> schema={schema} statusOptions={statusOptions} buildTile={buildTile} fetchData={searchData} params={searchParams} />
    );

    const isFetchSection = (section: FetchSection | QuerySection): section is FetchSection => 'fetchData' in section;

    const homeView = (
        <View>
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={[ ...sections, 'stats' ]}
                renderItem={({ item }: { item: ReactElement | FetchSection | QuerySection | 'stats' }) => {
                    if (isValidElement(item)) {
                        return item;
                    }
                    if (item === 'stats') {
                        return (
                            <Stats<G, S> schema={schema} statusOptions={statusOptions} />
                        );
                    }
                    const header = { title: item.title, link: item.viewAll };
                    if (isFetchSection(item)) {
                        return (
                            <FetchList<G, S> buildTile={buildTile} fetchData={item.fetchData} schema={schema} statusOptions={statusOptions} header={header} limit={item.limit} />
                        );
                    }
                    return (
                        <QueryList<G, S> query={item.query} queryParams={item.queryParams} getDetail={item.getDetail} schema={schema} statusOptions={statusOptions} header={header} limit={item.limit} />
                    );
                }}
            />
        </View>
    );

    return searchText.length ? searchView : homeView;

}
