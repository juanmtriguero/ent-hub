import { createMovieTables } from '@/util/movies';
import { create } from 'zustand';

export type SettingsState = {
    enabled: boolean;
    toggleEnabled: () => void;
};

const toggleEnabled = (state: SettingsState) => ({ enabled: !state.enabled });
const handleError = (error: any) => {
    console.error(error);
    alert('There was an error, please try again');
};

export const useMoviesAndTVSettings = create<SettingsState>((set) => ({
    enabled: false,
    toggleEnabled: () => createMovieTables().then(() => set(toggleEnabled)).catch(handleError),
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
