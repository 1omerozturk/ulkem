import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";
import { initDB } from "@/model/db";
import Loading from "@/components/Loading";
import { COLORS } from "@/constants/Colors";

function AppNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const prepareApp = async () => {
      try {
        await initDB();
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
  }, [checkAuth]);

  useEffect(() => {
    if (!isReady) return;

    const isInAuthGroup = segments[0] === "(auth)";
    if (!user && !isInAuthGroup) {
      router.replace("/(auth)");
    } else if (user && isInAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isReady, segments, user, router]);

  if (!isReady) {
    return <Loading message="Dünyalar keşfe hazırlanıyor…" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.authBackground },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <AppNavigator />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
