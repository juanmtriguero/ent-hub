import FetchList from '@/components/FetchList';
import MovieFilter, { MovieFilterParams } from '@/components/MovieFilter';
import { getPopularMovies } from '@/integration/tmdb';
import { Movie } from '@/models/movies';
import { getMovieTile, movieStatusOptions } from '@/util/movies';
import { useState } from 'react';
import { FlatList, View } from 'react-native';

export default function MoviesPopular() {

    const [ filter, setFilter ] = useState<MovieFilterParams>({});

    return (
        <View>
            <FlatList data={[
                <MovieFilter onChange={setFilter} />,
                <FetchList schema={Movie} statusOptions={movieStatusOptions} buildTile={getMovieTile} fetchData={getPopularMovies} params={filter} />,
            ]} renderItem={({ item }: { item: React.JSX.Element }) => item} />
        </View>
    );

}