import { Status } from '@/components/Screen';
import TileList, { Tile } from '@/components/TileList';
import { SavedItem } from '@/models/interfaces';
import { Realm, useQuery } from '@realm/react';
import { Href } from 'expo-router';
import { useEffect, useState } from 'react';

type Props = {
    buildTile: (item: any) => Tile,
    fetchData: (page: number, params: any, signal: AbortSignal) => Promise<{ numPages: number, results: any[] }>,
    schema: Realm.ObjectClass<SavedItem & Realm.Object>,
    statusOptions: Status[],
    header?: { title: string, link: Href },
    limit?: number,
    params?: any,
};

export default function FetchList({ fetchData, buildTile, schema, statusOptions, header, limit, params }: Props) {

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ numPages, setNumPages ] = useState<number>(0);
    const [ page, setPage ] = useState<number>(1);
    const [ tiles, setTiles ] = useState<Tile[]>([]);

    let controller = new AbortController();

    const getTiles = (): Promise<Tile[]> => {
        setIsLoading(true);
        return fetchData(page, params, controller.signal)
        .then(({ numPages, results }) => {
            setNumPages(numPages);
            return results.map(buildTile);
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
            return [];
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const limitTiles = (tiles: Tile[]): Tile[] => {
        if (limit) {
            return tiles.slice(0, limit);
        }
        return tiles;
    };

    useEffect(() => {
        controller.abort();
        controller = new AbortController();
        getTiles().then(newTiles => {
            setTiles(limitTiles(newTiles));
        });
        setPage(1);
    }, [params]);

    useEffect(() => {
        if (page > 1) {
            getTiles().then(newTiles => {
                setTiles(limitTiles([ ...tiles, ...newTiles ]));
            });
        }
    }, [page]);

    const statuses = useQuery({
        type: schema,
        query: (collection) => {
            return collection.filtered('id IN $0', tiles.map(tile => tile.id));
        }
    }, [tiles]);

    const getStatus = (item: Tile) => {
        return statuses.filtered('id == $0', item.id)[0]?.status;
    };

    const nextPage = () => {
        if (page < numPages && (!limit || tiles.length < limit)) {
            setPage(page + 1);
        }
    };

    return (
        <TileList tiles={tiles} statusOptions={statusOptions} isLoading={isLoading} getStatus={getStatus} nextPage={nextPage} header={header} />
    );

}
