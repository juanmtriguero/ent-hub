import BookFilter, { BookFilterParams } from '@/components/BookFilter';
import FetchList from '@/components/FetchList';
import { getPopularBooks } from '@/integration/openLibrary';
import { Book, BookGenre } from '@/models/books';
import { getBookTile, bookStatusOptions } from '@/util/books';
import { useState } from 'react';
import { FlatList, View } from 'react-native';

export default function BooksPopular() {

    const [ filter, setFilter ] = useState<BookFilterParams>({});

    return (
        <View>
            <FlatList data={[
                <BookFilter key="filter" onChange={setFilter} />,
                <FetchList<BookGenre, Book> key="list" schema={Book} statusOptions={bookStatusOptions} buildTile={getBookTile} fetchData={getPopularBooks} params={filter} />,
            ]} renderItem={({ item }: { item: React.JSX.Element }) => item} />
        </View>
    );

}