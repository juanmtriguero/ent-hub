import BookFilter, { buildBookQuery } from '@/components/BookFilter';
import StatusPage from '@/components/StatusPage';
import { Book, BookGenre } from '@/models/books';
import { getBookDetail, bookStatusOptions } from '@/util/books';

export default function BooksPaused() {

    return (
        <StatusPage<BookGenre, Book> buildQuery={buildBookQuery} FilterComponent={BookFilter} getDetail={getBookDetail} schema={Book} status="paused" statusOptions={bookStatusOptions} />
    );

}
