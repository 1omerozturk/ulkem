import Lottie from "lottie-react-native";
import { StyleSheet, Text, View } from "react-native";
import { BRAND } from "../constants/GameConfig";
import { useAppTheme } from "../hooks/useAppTheme";

export default function Loading({
  message = BRAND.loadingMessage,
  fullScreen = true,
  compact = false,
}) {
  const { colors } = useAppTheme();
  if (compact) {
    return (
      <View
        style={styles.compactContainer}
        accessibilityRole="progressbar"
        accessibilityLabel={message}
      >
        <Lottie
          source={require("../assets/lottie/yurtpusula-loading.json")}
          autoPlay
          loop
          style={styles.compactAnimation}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, fullScreen && { backgroundColor: colors.authBackground }]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <Lottie
        source={require("../assets/lottie/yurtpusula-loading.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={[styles.brand, { color: colors.authText }]}>{BRAND.name}</Text>
      <Text style={[styles.message, { color: colors.authTextMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  compactContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  compactAnimation: { width: 30, height: 30 },
  animation: { width: 156, height: 156, marginBottom: 15 },
  brand: {
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
    textAlign: "center",
  },
});
