import { Stack } from 'expo-router';

export default function MoviesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Movies' }} />
            <Stack.Screen name="popular" options={{ title: 'Popular Movies' }} />
            <Stack.Screen name="[movie]" options={{ title: '' }} />
        </Stack>
    );
}
