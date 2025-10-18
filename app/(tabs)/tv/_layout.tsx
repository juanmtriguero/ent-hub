import { Stack } from 'expo-router';

export default function TVLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'TV' }} />
            <Stack.Screen name="popular" options={{ title: 'Popular shows' }} />
            <Stack.Screen name="[tv]" options={{ title: '' }} />
        </Stack>
    );
}
