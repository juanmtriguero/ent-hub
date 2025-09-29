import { useBooksSettings, useComicsSettings, useGamesSettings, useMoviesAndTVSettings } from '@/util/state';
import { Redirect } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
    const moviesAndTVEnabled = useMoviesAndTVSettings(state => state.enabled);
    const booksEnabled = useBooksSettings(state => state.enabled);
    const gamesEnabled = useGamesSettings(state => state.enabled);
    const comicsEnabled = useComicsSettings(state => state.enabled);
    if (!moviesAndTVEnabled && !booksEnabled && !gamesEnabled && !comicsEnabled) {
        return <Redirect href="/" />;
    }
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="movies" hidden={!moviesAndTVEnabled}>
                <Label>Movies</Label>
                <Icon sf="movieclapper" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="tv" hidden={!moviesAndTVEnabled}>
                <Label>TV</Label>
                <Icon sf="tv" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="books" hidden={!booksEnabled}>
                <Label>Books</Label>
                <Icon sf="book" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="games" hidden={!gamesEnabled}>
                <Label>Games</Label>
                <Icon sf="gamecontroller" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="comics" hidden={!comicsEnabled}>
                <Label>Comics</Label>
                <Icon sf="magazine" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
