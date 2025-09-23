import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="movies">
                <Label>Movies</Label>
                <Icon sf="movieclapper" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="tv">
                <Label>TV</Label>
                <Icon sf="tv" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
