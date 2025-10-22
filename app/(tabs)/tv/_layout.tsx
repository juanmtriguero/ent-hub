import { Stack } from 'expo-router';

export default function TVLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'TV' }} />
            <Stack.Screen name="popular" options={{ title: 'Popular shows' }} />
            <Stack.Screen name="watching" options={{ title: 'Watching now' }} />
            <Stack.Screen name="paused" options={{ title: 'Resume watching' }} />
            <Stack.Screen name="pending" options={{ title: 'My watchlist' }} />
            <Stack.Screen name="watched" options={{ title: 'Recently watched' }} />
            <Stack.Screen name="abandoned" options={{ title: 'Abandoned' }} />
            <Stack.Screen name="[tv]" options={{ title: '' }} />
        </Stack>
    );
}
