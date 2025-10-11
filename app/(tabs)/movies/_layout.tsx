import { Movie, MovieGenre, MovieProvider } from '@/models/movies';
import { RealmProvider } from '@realm/react';
import { Stack } from 'expo-router';

export default function MoviesLayout() {
    return (
        // FIXME: remove deleteRealmIfMigrationNeeded after development
        <RealmProvider schema={[ Movie, MovieGenre, MovieProvider ]} deleteRealmIfMigrationNeeded>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Movies' }} />
                <Stack.Screen name="popular" options={{ title: 'Popular Movies' }} />
                <Stack.Screen name="pending" options={{ title: 'Want to watch' }} />
                <Stack.Screen name="watched" options={{ title: 'Watched Movies' }} />
                <Stack.Screen name="[movie]" options={{ title: '' }} />
            </Stack>
        </RealmProvider>
    );
}
