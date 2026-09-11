import Index, { FetchSection, QuerySection } from '@/components/Index';
import { searchBooks } from '@/integration/openLibrary';
import { Book, BookGenre } from '@/models/books';
import { getBookTile, bookStatusOptions } from '@/util/books';

const sections: (FetchSection | QuerySection)[] = [
    // TODO: Add sections
];

export default function BooksIndex() {

    return (
        <Index<BookGenre, Book> buildTile={getBookTile} schema={Book} searchData={searchBooks} searchOn="books" sections={sections} statusOptions={bookStatusOptions} actions={[]} />
    );

}
