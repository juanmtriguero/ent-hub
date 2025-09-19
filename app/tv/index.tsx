import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function TVIndex() {
    return (
        <View>
            <Stack.Screen options={{ title: 'TV' }} />
        </View>
    );
}
