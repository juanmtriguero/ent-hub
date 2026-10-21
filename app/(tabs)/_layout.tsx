import { useBooksSettings, useComicsSettings, useGamesSettings, useMoviesAndTVSettings } from '@/util/state';
import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabsLayout() {
    const moviesAndTVEnabled = useMoviesAndTVSettings(state => state.enabled);
    const booksEnabled = useBooksSettings(state => state.enabled);
    const gamesEnabled = useGamesSettings(state => state.enabled);
    const comicsEnabled = useComicsSettings(state => state.enabled);
    if (!moviesAndTVEnabled && !booksEnabled && !gamesEnabled && !comicsEnabled) {
        return <Redirect href="/" />;
    }
    return (
        <NativeTabs disableTransparentOnScrollEdge>
            <NativeTabs.Trigger name="movies" hidden={!moviesAndTVEnabled}>
                <NativeTabs.Trigger.Label>Movies</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="movieclapper" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="tv" hidden={!moviesAndTVEnabled}>
                <NativeTabs.Trigger.Label>TV</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="tv" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="books" hidden={!booksEnabled}>
                <NativeTabs.Trigger.Label>Books</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="book" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="games" hidden={!gamesEnabled}>
                <NativeTabs.Trigger.Label>Games</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="gamecontroller" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="comics" hidden={!comicsEnabled}>
                <NativeTabs.Trigger.Label>Comics</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="magazine" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
