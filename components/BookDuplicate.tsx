import { Book, BookItem } from '@/models/books';
import { getBookDetail } from '@/util/books';
import { Realm, useRealm } from '@realm/react';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, AlertButton } from 'react-native';

type Props = {
    book: BookItem | Book;
};

export default function BookDuplicate({ book }: Props) {

    const realm = useRealm();
    const router = useRouter();
    
    const isSavedBook = (book: BookItem | Book): book is Book => (book as Book).status !== undefined;

    const navigateToCanonicalBook = (canonicalId: string) => {
        router.push(getBookDetail(canonicalId));
    };

    const replaceWithCanonicalBook = (canonicalId: string) => {
        realm.write(() => {
            realm.create(Book, { ...book, id: canonicalId, canonicalId: undefined }, Realm.UpdateMode.Modified);
            realm.delete(book);
        });
        navigateToCanonicalBook(canonicalId);
    };

    useEffect(() => {
        if (book.canonicalId) {
            let text;
            const buttons: AlertButton[] = [ { text: 'Cancel', style: 'cancel' } ];
            const { canonicalId } = book;
            if (isSavedBook(book)) {
                text = 'Do you want to replace it on your collection with the canonical book and navigate to it?';
                buttons.push({ text: 'Replace', onPress: () => replaceWithCanonicalBook(canonicalId), style: 'destructive' });
                buttons.push({ text: 'Just navigate', onPress: () => navigateToCanonicalBook(canonicalId) });
            } else {
                text = 'Do you want to navigate to the canonical book?';
                buttons.push({ text: 'Navigate', onPress: () => navigateToCanonicalBook(canonicalId) });
            }
            Alert.alert('This book is a duplicate', text, buttons);
        }
    }, []);

    return null;

}