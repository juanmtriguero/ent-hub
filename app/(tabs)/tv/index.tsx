import Index from '@/components/Index';
import { View } from 'react-native';

export default function TVIndex() {

    const homeView = (
        <View />
    );

    const searchFunction = (text: string, signal: AbortSignal) => {
        // TODO: search on TV
        return Promise.resolve([]);
    };

    return (
        <Index homeView={homeView} searchFunction={searchFunction} searchOn="TV" title="TV" />
    );

}
