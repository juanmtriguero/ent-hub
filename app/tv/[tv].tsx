import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function TVScreen() {
    const { tv } = useLocalSearchParams<{ tv: string }>();

    return (
        <View>
            <Stack.Screen options={{ title: tv }} />
        </View>
    );
}
