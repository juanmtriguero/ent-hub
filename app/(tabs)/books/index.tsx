import Index, { FetchSection, QuerySection } from '@/components/Index';
import { getPopularBooks, searchBooks } from '@/integration/openLibrary';
import { Book, BookGenre } from '@/models/books';
import { getBookDetail, getBookTile, bookStatusOptions } from '@/util/books';

const sections: (FetchSection | QuerySection)[] = [
    {
        fetchData: getPopularBooks,
        limit: 4,
        title: 'Popular books',
        viewAll: { pathname: '/books/popular' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'reading' ],
        getDetail: getBookDetail,
        limit: 4,
        title: 'Reading now',
        viewAll: { pathname: '/books/reading' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'paused' ],
        getDetail: getBookDetail,
        limit: 4,
        title: 'Resume reading',
        viewAll: { pathname: '/books/paused' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'pending' ],
        getDetail: getBookDetail,
        limit: 4,
        title: 'Want to read',
        viewAll: { pathname: '/books/pending' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'read' ],
        getDetail: getBookDetail,
        limit: 4,
        title: 'Recently read',
        viewAll: { pathname: '/books/read' },
    },
    {
        query: 'status == $0',
        queryParams: [ 'abandoned' ],
        getDetail: getBookDetail,
        limit: 4,
        title: 'Abandoned',
        viewAll: { pathname: '/books/abandoned' },
    },
];

export default function BooksIndex() {

    return (
        <Index<BookGenre, Book> buildTile={getBookTile} schema={Book} searchData={searchBooks} searchOn="books" sections={sections} statusOptions={bookStatusOptions} actions={[]} />
    );

}
