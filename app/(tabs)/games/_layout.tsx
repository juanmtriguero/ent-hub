import { Stack } from 'expo-router';

export default function GamesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Games' }} />
            <Stack.Screen name="latest" options={{ title: 'Latest games' }} />
            <Stack.Screen name="playing" options={{ title: 'Playing now' }} />
            <Stack.Screen name="paused" options={{ title: 'Resume playing' }} />
            <Stack.Screen name="pending" options={{ title: 'Want to play' }} />
            <Stack.Screen name="finished" options={{ title: 'Recently finished' }} />
            <Stack.Screen name="completed" options={{ title: 'Recently completed' }} />
            <Stack.Screen name="abandoned" options={{ title: 'Abandoned' }} />
            <Stack.Screen name="[game]" options={{ title: '' }} />
            <Stack.Screen name="franchises/[franchise]" options={{ title: '' }} />
        </Stack>
    );
}
