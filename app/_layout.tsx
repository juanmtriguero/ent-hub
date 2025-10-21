import { Movie, MovieGenre, MovieProvider } from '@/models/movies';
import { TV, TVEpisode, TVGenre, TVProvider, TVSeason } from '@/models/tv';
import { RealmProvider } from '@realm/react';
import { Stack } from 'expo-router';

const schema = [
    Movie,
    MovieGenre,
    MovieProvider,
    TV,
    TVEpisode,
    TVGenre,
    TVProvider,
    TVSeason,
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
