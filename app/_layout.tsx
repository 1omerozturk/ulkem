import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";
import { initDB } from "@/model/db";
import Loading from "@/components/Loading";
import { GameAudioProvider } from "@/components/GameAudioProvider";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

function AppNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const user = useAuthStore((state) => state.user);
  const hasCompletedFirstRun = useAuthStore((state) => state.hasCompletedFirstRun);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const hydrateSettings = useGameSettingsStore((state) => state.hydrate);
  const { colors } = useAppTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const prepareApp = async () => {
      try {
        await initDB();
        await hydrateSettings();
        await checkAuth();
      } catch (error) {
        console.error("Uygulama başlatılamadı:", error);
      } finally {
        if (isMounted) setIsReady(true);
      }
    };

    prepareApp();
    return () => {
      isMounted = false;
    };
  }, [checkAuth, hydrateSettings]);

  useEffect(() => {
    if (!isReady) return;

    const isInAuthGroup = segments[0] === "(auth)";
    const isInWelcome = segments[0] === "(auth)" && segments[1] === "welcome";
    if (!user && !isInAuthGroup) {
      router.replace("/(auth)");
    } else if (user && !hasCompletedFirstRun && !isInWelcome) {
      router.replace("/(auth)/welcome");
    } else if (user && hasCompletedFirstRun && isInAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isReady, segments, user, hasCompletedFirstRun, router]);

  if (!isReady) {
    return <Loading message="Dünyalar keşfe hazırlanıyor…" />;
  }

  return (
    <GameAudioProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.authBackground },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GameAudioProvider>
  );
}

export default function RootLayout() {
  const { theme } = useAppTheme();
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <AppNavigator />
      </SafeScreen>
      <StatusBar style={theme.statusBarStyle} />
    </SafeAreaProvider>
  );
}
