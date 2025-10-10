import { Stack } from 'expo-router';
import { RealmProvider } from '@realm/react';
import { Movie } from '@/schema/movies';

export default function MoviesLayout() {
    return (
        <RealmProvider schema={[ Movie ]}>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Movies' }} />
                <Stack.Screen name="popular" options={{ title: 'Popular Movies' }} />
                <Stack.Screen name="[movie]" options={{ title: '' }} />
            </Stack>
        </RealmProvider>
    );
}
