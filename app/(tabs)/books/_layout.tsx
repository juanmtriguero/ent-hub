import { Stack } from 'expo-router';

export default function BooksLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Books' }} />
            <Stack.Screen name="popular" options={{ title: 'Popular books' }} />
            <Stack.Screen name="reading" options={{ title: 'Reading now' }} />
            <Stack.Screen name="paused" options={{ title: 'Resume reading' }} />
            <Stack.Screen name="pending" options={{ title: 'Want to read' }} />
            <Stack.Screen name="read" options={{ title: 'Recently read' }} />
            <Stack.Screen name="abandoned" options={{ title: 'Abandoned' }} />
            <Stack.Screen name="[book]" options={{ title: '' }} />
        </Stack>
    );
}
