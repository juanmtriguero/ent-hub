import { Status } from '@/components/Screen';
import TileList, { Tile } from '@/components/TileList';
import { Genre, SavedItem } from '@/models/interfaces';
import { Realm, useQuery } from '@realm/react';
import { Href } from 'expo-router';

type Props<G extends Genre, S extends SavedItem<G> & Realm.Object> = {
    query: string,
    queryParams: any[],
    getDetail: (id: string) => Href,
    schema: Realm.ObjectClass<S>,
    statusOptions: Status[],
    header?: { title: string, link: Href },
    limit?: number,
};

export default function QueryList<G extends Genre, S extends SavedItem<G> & Realm.Object>({ query, queryParams, getDetail, schema, statusOptions, header, limit }: Props<G, S>) {

    const data = useQuery(schema).filtered(query, ...queryParams).sorted('timestamp', true);

    const tiles: Tile[] = data ? data.slice(0, limit).map(item => ({
        detail: getDetail(item.id),
        id: item.id,
        posterUrl: item.posterUrl,
        releaseYear: item.releaseYear,
        title: item.title,
        status: item.status,
    })) : [];

    return (
        <TileList tiles={tiles} statusOptions={statusOptions} isLoading={false} getStatus={item => item.status} header={header} />
    );

}
