import { Stack } from 'expo-router';

export default function MoviesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Movies' }} />
            <Stack.Screen name="popular" options={{ title: 'Popular movies' }} />
            <Stack.Screen name="pending" options={{ title: 'My watchlist' }} />
            <Stack.Screen name="watched" options={{ title: 'Recently watched' }} />
            <Stack.Screen name="[movie]" options={{ title: '' }} />
        </Stack>
    );
}
