import MovieFilter, { MovieFilterParams, buildMovieQuery } from '@/components/MovieFilter';
import QueryList from '@/components/QueryList';
import { Movie } from '@/models/movies';
import { getMovieDetail, movieStatusOptions } from '@/util/movies';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

export default function MoviesWatched() {

    const [ filter, setFilter ] = useState<MovieFilterParams>({});
    const [ query, setQuery ] = useState<string>('status == $0');
    const [ queryParams, setQueryParams ] = useState<any[]>(['watched']);

    useEffect(() => {
        const { query, queryParams } = buildMovieQuery(filter);
        setQuery([ ...query, `status == $${queryParams.length}` ].join(' AND '));
        setQueryParams([ ...queryParams, 'watched' ]);
    }, [ filter ]);

    return (
        <View>
            <FlatList data={[
                <MovieFilter onChange={setFilter} />,
                <QueryList schema={Movie} statusOptions={movieStatusOptions} query={query} queryParams={queryParams} getDetail={getMovieDetail} />,
            ]} renderItem={({ item }: { item: React.JSX.Element }) => item} />
        </View>
    );

}