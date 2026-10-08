import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSegments } from "expo-router";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";
import { AppState } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useGameSettingsStore } from "../store/gameSettingsStore";

const GameAudioContext = createContext(null);

const soundSources = {
  answerSelect: require("../assets/audio/answer-select.wav"),
  correct: require("../assets/audio/answer-correct.wav"),
  incorrect: require("../assets/audio/answer-wrong.mp3"),
};

export function GameAudioProvider({ children }) {
  const [audioModeReady, setAudioModeReady] = useState(false);
  const segments = useSegments();
  const user = useAuthStore((state) => state.user);
  const musicEnabled = useGameSettingsStore((state) => state.musicEnabled);
  const soundEffectsEnabled = useGameSettingsStore((state) => state.soundEffectsEnabled);
  const hapticsEnabled = useGameSettingsStore((state) => state.hapticsEnabled);
  const hasHydrated = useGameSettingsStore((state) => state.hasHydrated);
  const hydrate = useGameSettingsStore((state) => state.hydrate);

  const musicPlayer = useAudioPlayer(require("../assets/audio/menu-ambience.mp3"));
  const answerSelectPlayer = useAudioPlayer(soundSources.answerSelect);
  const correctPlayer = useAudioPlayer(soundSources.correct);
  const incorrectPlayer = useAudioPlayer(soundSources.incorrect);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    let isActive = true;
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "mixWithOthers" })
      .then(() => {
        if (isActive) setAudioModeReady(true);
      })
      .catch((error) => console.warn("Ses oturumu ayarlanamadı:", error));
    musicPlayer.loop = true;
    musicPlayer.volume = 0.16;
    answerSelectPlayer.volume = 0.24;
    correctPlayer.volume = 0.32;
    incorrectPlayer.volume = 0.26;
    return () => {
      isActive = false;
    };
  }, [answerSelectPlayer, correctPlayer, incorrectPlayer, musicPlayer]);

  const isTabApp = segments[0] === "(tabs)";
  const isQuizInProgress = segments[1] === "quiz" && segments[2] === "[type]";
  const shouldPlayMenuMusic = Boolean(
    user && hasHydrated && audioModeReady && musicEnabled && isTabApp && !isQuizInProgress,
  );

  useEffect(() => {
    if (shouldPlayMenuMusic) {
      musicPlayer.play();
    } else {
      musicPlayer.pause();
    }

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && shouldPlayMenuMusic) {
        musicPlayer.play();
      } else {
        musicPlayer.pause();
      }
    });
    return () => subscription.remove();
  }, [musicPlayer, shouldPlayMenuMusic]);

  const playSound = (name) => {
    if (!soundEffectsEnabled) return;
    const player = {
      answerSelect: answerSelectPlayer,
      correct: correctPlayer,
      incorrect: incorrectPlayer,
    }[name];
    if (!player) return;
    player.seekTo(0).then(() => player.play()).catch(() => {});
  };

  const vibrate = (kind = "selection") => {
    if (!hapticsEnabled) return;
    const feedback = kind === "success"
      ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      : Haptics.selectionAsync();
    feedback.catch(() => {});
  };

  const value = useMemo(() => ({ playSound, vibrate }), [
    soundEffectsEnabled,
    hapticsEnabled,
    answerSelectPlayer,
    correctPlayer,
    incorrectPlayer,
  ]);

  return (
    <GameAudioContext.Provider value={value}>
      {children}
    </GameAudioContext.Provider>
  );
}

export function useGameAudio() {
  const context = useContext(GameAudioContext);
  if (!context) {
    throw new Error("useGameAudio, GameAudioProvider içinde kullanılmalıdır.");
  }
  return context;
}
