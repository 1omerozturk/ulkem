import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const SETTINGS_KEY = "yurtpusula_game_settings";

export const useGameSettingsStore = create((set, get) => ({
  musicEnabled: true,
  soundEffectsEnabled: true,
  hapticsEnabled: true,
  hasHydrated: false,

  hydrate: async () => {
    if (get().hasHydrated) return;
    try {
      const saved = await SecureStore.getItemAsync(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        set({
          musicEnabled: parsed.musicEnabled !== false,
          soundEffectsEnabled: parsed.soundEffectsEnabled !== false,
          hapticsEnabled: parsed.hapticsEnabled !== false,
        });
      }
    } catch (error) {
      console.warn("Oyun tercihleri yüklenemedi:", error);
    } finally {
      set({ hasHydrated: true });
    }
  },

  setPreference: async (key, value) => {
    const next = { ...get(), [key]: value };
    set({ [key]: value });
    try {
      await SecureStore.setItemAsync(
        SETTINGS_KEY,
        JSON.stringify({
          musicEnabled: next.musicEnabled,
          soundEffectsEnabled: next.soundEffectsEnabled,
          hapticsEnabled: next.hapticsEnabled,
        }),
      );
    } catch (error) {
      console.warn("Oyun tercihi kaydedilemedi:", error);
    }
  },
}));
