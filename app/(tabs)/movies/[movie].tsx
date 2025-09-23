import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function MovieScreen() {
    const { movie } = useLocalSearchParams<{ movie: string }>();

    return (
        <View>
            <Stack.Screen options={{ title: movie }} />
        </View>
    );
}
