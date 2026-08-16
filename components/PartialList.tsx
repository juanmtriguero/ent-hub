import { Status } from '@/components/Screen';
import TileList, { Tile } from '@/components/TileList';
import { Genre, PartialItem, SavedItem } from '@/models/interfaces';
import { useQuery } from '@realm/react';
import { Href } from 'expo-router';

type Props<G extends Genre, S extends SavedItem<G> & Realm.Object> = {
    partialItems: PartialItem[] | Realm.List<PartialItem & Realm.Object>,
    mainSchema: Realm.RealmObjectConstructor<S>,
    statusOptions: Status[],
    getDetail: (id: string) => Href,
};

export default function PartialList<G extends Genre, S extends SavedItem<G> & Realm.Object>({ partialItems, mainSchema, statusOptions, getDetail }: Props<G, S>) {

    const tiles: Tile[] = partialItems.map((partialItem: PartialItem) => ({
        ...partialItem,
        detail: getDetail(partialItem.id),
    }));

    const statuses = useQuery({
        type: mainSchema,
        query: (collection) => {
            return collection.filtered('id IN $0', partialItems.map(item => item.id));
        }
    }, [partialItems]);

    const getStatus = (item: Tile) => {
        return statuses.filtered('id == $0', item.id)[0]?.status;
    };

    return (
        <TileList tiles={tiles} statusOptions={statusOptions} isLoading={false} getStatus={getStatus} horizontal />
    );

}