import { create } from 'zustand';

export type SettingsState = {
    enabled: boolean;
    toggleEnabled: () => void;
};

const toggleEnabled = (state: SettingsState) => ({ enabled: !state.enabled });

export const useMoviesAndTVSettings = create<SettingsState>((set) => ({
    enabled: false,
    toggleEnabled: () => set(toggleEnabled),
}));

export const useBooksSettings = create<SettingsState>((set) => ({
    enabled: false,
    toggleEnabled: () => set(toggleEnabled),
}));

export const useGamesSettings = create<SettingsState>((set) => ({
    enabled: false,
    toggleEnabled: () => set(toggleEnabled),
}));

export const useComicsSettings = create<SettingsState>((set) => ({
    enabled: false,
    toggleEnabled: () => set(toggleEnabled),
}));
