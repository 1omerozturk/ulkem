import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/Colors";

export default function BackButton({ onPress, accessibilityLabel = "Geri dön" }) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.button}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
    >
      <Ionicons name="arrow-back" size={22} color={COLORS.authText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 14,
    left: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.authSurface,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
  },
});
