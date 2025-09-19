import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function MoviesIndex() {
    return (
        <View>
            <Stack.Screen options={{ title: 'Movies' }} />
        </View>
    );
}
