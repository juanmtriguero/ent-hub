import { Movie, MovieGenre, MovieProvider } from '@/models/movies';
import { TV, TVGenre, TVProvider } from '@/models/tv';
import { RealmProvider } from '@realm/react';
import { Stack } from 'expo-router';

const schema = [
    Movie,
    MovieGenre,
    MovieProvider,
    TV,
    TVGenre,
    TVProvider, 
];

export default function Layout() {
    return (
        // FIXME: remove deleteRealmIfMigrationNeeded after development
        <RealmProvider schema={schema} deleteRealmIfMigrationNeeded>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
            </Stack>
        </RealmProvider>
    );
}
