import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { THEMES } from "../constants/Colors";

const SETTINGS_KEY = "yurtpusula_game_settings";

export const useGameSettingsStore = create((set, get) => ({
  musicEnabled: true,
  soundEffectsEnabled: true,
  hapticsEnabled: true,
  themeId: "explorer",
  hasHydrated: false,

  hydrate: async () => {
    if (get().hasHydrated) return;
    try {
      const saved = await SecureStore.getItemAsync(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedThemeId = parsed.themeId === "forest" ? "explorer" : parsed.themeId;
        set({
          musicEnabled: parsed.musicEnabled !== false,
          soundEffectsEnabled: parsed.soundEffectsEnabled !== false,
          hapticsEnabled: parsed.hapticsEnabled !== false,
          themeId: THEMES[savedThemeId] ? savedThemeId : "explorer",
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
          themeId: next.themeId,
        }),
      );
    } catch (error) {
      console.warn("Oyun tercihi kaydedilemedi:", error);
    }
  },

  setTheme: async (themeId) => {
    if (!THEMES[themeId]) return;
    set({ themeId });
    try {
      const current = get();
      await SecureStore.setItemAsync(
        SETTINGS_KEY,
        JSON.stringify({
          musicEnabled: current.musicEnabled,
          soundEffectsEnabled: current.soundEffectsEnabled,
          hapticsEnabled: current.hapticsEnabled,
          themeId,
        }),
      );
    } catch (error) {
      console.warn("Oyun teması kaydedilemedi:", error);
    }
  },
}));
