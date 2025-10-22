import QueryList from '@/components/QueryList';
import { Status } from '@/components/Screen';
import { SavedItem } from '@/models/interfaces';
import { Realm } from '@realm/react';
import { Href } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

type Props = {
    buildQuery: (filter: any) => { query: string[], queryParams: any[] },
    FilterComponent: React.ComponentType<{ onChange: (filter: any) => void }>,
    getDetail: (id: string) => Href,
    schema: Realm.ObjectClass<SavedItem & Realm.Object>,
    status: string,
    statusOptions: Status[],
};

export default function StatusPage({ buildQuery, FilterComponent, getDetail, schema, status, statusOptions }: Props) {

    const [ filter, setFilter ] = useState<any>({});
    const [ query, setQuery ] = useState<string>('status == $0');
    const [ queryParams, setQueryParams ] = useState<any[]>([ status ]);

    useEffect(() => {
        const { query, queryParams } = buildQuery(filter);
        setQuery([ ...query, `status == $${queryParams.length}` ].join(' AND '));
        setQueryParams([ ...queryParams, status ]);
    }, [ filter ]);

    return (
        <View>
            <FlatList data={[
                <FilterComponent onChange={setFilter} />,
                <QueryList schema={schema} statusOptions={statusOptions} query={query} queryParams={queryParams} getDetail={getDetail} />,
            ]} renderItem={({ item }: { item: React.JSX.Element }) => item} />
        </View>
    );

}