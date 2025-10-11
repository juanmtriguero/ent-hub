import { Movie, MovieGenre, MovieProvider } from '@/models/movies';
import { RealmProvider } from '@realm/react';
import { Stack } from 'expo-router';

export default function MoviesLayout() {
    return (
        // FIXME: remove deleteRealmIfMigrationNeeded after development
        <RealmProvider schema={[ Movie, MovieGenre, MovieProvider ]} deleteRealmIfMigrationNeeded>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Movies' }} />
                <Stack.Screen name="popular" options={{ title: 'Popular movies' }} />
                <Stack.Screen name="pending" options={{ title: 'My watchlist' }} />
                <Stack.Screen name="watched" options={{ title: 'Recently watched' }} />
                <Stack.Screen name="[movie]" options={{ title: '' }} />
            </Stack>
        </RealmProvider>
    );
}
