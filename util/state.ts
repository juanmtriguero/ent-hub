import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const storage = createJSONStorage(() => AsyncStorage);

type GeneralSettingsState = {
    ready: boolean;
    setReady: (value: boolean) => void;
};

export const useGeneralSettings = create<GeneralSettingsState>()(persist((set) => ({
    ready: false,
    setReady: (value) => set({ ready: value }),
}), { name: 'generalSettings', storage: storage }));

export type SettingsState = {
    enabled: boolean;
    toggleEnabled: () => void;
};

const useSettings = (name: string) => {
    return create<SettingsState>()(persist((set, get) => ({
        enabled: false,
        toggleEnabled: () => {
            try {
                const enabled = get().enabled;
                if (enabled) {
                    const totalEnabled = [
                        useMoviesAndTVSettings.getState().enabled,
                        useBooksSettings.getState().enabled,
                        useGamesSettings.getState().enabled,
                        useComicsSettings.getState().enabled,
                    ].reduce((totalEnabled, enabled) => {
                        if (enabled) {
                            totalEnabled++;
                        }
                        return totalEnabled;
                    }, 0);
                    if (totalEnabled <= 1) {
                        alert('You must enable at least one service');
                        return;
                    }
                }
                set({ enabled: !enabled });
            } catch (error) {
                console.error(error);
                alert('There was an error, please try again');
            }
        },
    }), { name: name, storage: storage }));
};

export const useMoviesAndTVSettings = useSettings('moviesAndTVSettings');
export const useBooksSettings = useSettings('booksSettings');
export const useGamesSettings = useSettings('gamesSettings');
export const useComicsSettings = useSettings('comicsSettings');
