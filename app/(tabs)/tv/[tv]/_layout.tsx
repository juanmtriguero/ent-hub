import { Stack } from 'expo-router';

export default function TVScreenLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[season]" options={{ presentation: 'modal' }} />
        </Stack>
    );
}
