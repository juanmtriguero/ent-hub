import { Redirect } from 'expo-router';

export default function Index() {
    // FIXME: Redirect to the first active tab or settings if none
    return <Redirect href="/(tabs)/movies" />;
}
