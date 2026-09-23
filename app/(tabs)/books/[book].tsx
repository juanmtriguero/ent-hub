import BookDuplicate from '@/components/BookDuplicate';
import Screen from '@/components/Screen';
import { getBook } from '@/integration/hardcover';
import { Book, BookItem, BookGenre } from '@/models/books';
import { buildBook, getBookDetail, bookStatusOptions } from '@/util/books';
import { useLocalSearchParams } from 'expo-router';

export default function BookScreen() {

    const { book } = useLocalSearchParams<{ book: string }>();

    const additionalContent = (item: BookItem | Book) => (
        <BookDuplicate book={item} />
    );

    return (
        <Screen<BookItem, BookGenre, Book> additionalContent={additionalContent} buildItem={buildBook} fetchData={getBook} id={book} schema={Book} statusOptions={bookStatusOptions} getDetail={getBookDetail} />
    );

}
