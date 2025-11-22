import { Status } from '@/components/Screen';
import TileList, { Tile } from '@/components/TileList';
import { Genre, SavedItem } from '@/models/interfaces';
import { Realm, useQuery } from '@realm/react';
import { Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

type Props<G extends Genre, S extends SavedItem<G> & Realm.Object> = {
    buildTile: (item: any) => Tile,
    fetchData: (page: number, params: any, signal: AbortSignal) => Promise<{ numPages: number, results: any[] }>,
    schema: Realm.ObjectClass<S>,
    statusOptions: Status[],
    header?: { title: string, link: Href },
    limit?: number,
    params?: any,
};

export default function FetchList<G extends Genre, S extends SavedItem<G> & Realm.Object>({ fetchData, buildTile, schema, statusOptions, header, limit, params }: Props<G, S>) {

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ numPages, setNumPages ] = useState<number>(0);
    const [ page, setPage ] = useState<number>(1);
    const [ tiles, setTiles ] = useState<Tile[]>([]);

    const controller = useRef<AbortController>(new AbortController());

    const getTiles = (signal: AbortSignal): Promise<Tile[]> => {
        setIsLoading(true);
        return fetchData(page, params, signal)
        .then(({ numPages, results }) => {
            setNumPages(numPages);
            return results.map(buildTile);
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
            setNumPages(0);
            return [];
        })
        .finally(() => {
            if (!signal.aborted) {
                setIsLoading(false);
            }
        });
    };

    const limitTiles = (tiles: Tile[]): Tile[] => {
        if (limit) {
            return tiles.slice(0, limit);
        }
        return tiles;
    };

    useEffect(() => {
        controller.current.abort();
        setNumPages(0);
        setTiles([]);
        const newController = new AbortController();
        controller.current = newController;
        getTiles(newController.signal).then(newTiles => {
            if (!newController.signal.aborted) {
                setTiles(limitTiles(newTiles));
            }
        });
        setPage(1);
    }, [params]);

    useEffect(() => {
        if (page > 1) {
            getTiles(controller.current.signal).then(newTiles => {
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
