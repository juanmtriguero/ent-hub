import Screen from '@/components/Screen';
import { getBook } from '@/integration/openLibrary';
import { Book, BookGenre } from '@/models/books';
import { Item } from '@/models/interfaces';
import { buildBook, getBookDetail, bookStatusOptions } from '@/util/books';
import { useLocalSearchParams } from 'expo-router';

export default function BookScreen() {

    const { book } = useLocalSearchParams<{ book: string }>();

    return (
        <Screen<Item, BookGenre, Book> additionalContent={() => null} buildItem={buildBook} fetchData={getBook} id={book} schema={Book} statusOptions={bookStatusOptions} getDetail={getBookDetail} />
    );

}
