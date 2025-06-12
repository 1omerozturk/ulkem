// RootLayout.tsx
import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore"; // authStore dosyan
import { deleteUsers, getUsers, initDB } from "@/model/db";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      initDB();
      // const users = await getUsers();
      // console.log("users:", users);
      if (user) {
        console.log(user);
      }
      await checkAuth();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    if (!loading) {
      if (!user && !inAuthGroup) {
        router.replace("/(auth)");
      } else if (user && inAuthGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [segments, user, loading]);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Örnek ekran grupları */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
