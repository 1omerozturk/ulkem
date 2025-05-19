import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [loading, setLoading] = useState(true);

  // const { checkAuth, user, token } = useAuthStore();

  // useEffect(() => {
  //   const inAuthScreen = segments[0] === "(auth)";
  //   const isSignedIn = user && token;

  //   if (!loading) {
  //     if (!isSignedIn && !inAuthScreen) {
  //       router.replace("/(auth)");
  //     } else if (isSignedIn && inAuthScreen) {
  //       router.replace(user?.role === "admin" ? "/(dashboard)" : "/(tabs)");
  //     }
  //   }
  // }, [user, token, segments, loading]);

  // useEffect(() => {
  //   if (user !== undefined && token !== undefined) {
  //     setLoading(false);
  //   }
  // }, [user, token]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: true }}>
          {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(dashboard)" options={{ headerShown: false }} /> */}
          {/* <Stack.Screen name="productDetail/[id]" options={{ headerShown: false }}
          /> */}
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
