import { Stack } from 'expo-router';

export default function ComicsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Comics' }} />
            <Stack.Screen name="[comic]" options={{ title: '' }} />
        </Stack>
    );
}
