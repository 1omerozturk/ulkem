import { COLORS } from "@/constants/Colors";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="life" />
      <Stack.Screen name="quiz/[type]" />
      <Stack.Screen name="profile" />
      
    </Stack>
  );
}
