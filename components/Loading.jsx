import Lottie from "lottie-react-native";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/Colors";

export default function Loading({
  message = "Ülkem hazırlanıyor…",
  fullScreen = true,
  compact = false,
}) {
  if (compact) {
    return (
      <View
        style={styles.compactContainer}
        accessibilityRole="progressbar"
        accessibilityLabel={message}
      >
        <Lottie
          source={require("../assets/lottie/ulkem-loading.json")}
          autoPlay
          loop
          style={styles.compactAnimation}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, fullScreen && styles.fullScreen]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <Lottie
        source={require("../assets/lottie/ulkem-loading.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.brand}>Ülkem</Text>
      <Text style={styles.message}>{message}</Text>
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
  fullScreen: { backgroundColor: COLORS.authBackground },
  compactContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  compactAnimation: { width: 30, height: 30 },
  animation: { width: 156, height: 156, marginBottom: 15 },
  brand: {
    color: COLORS.authText,
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  message: {
    color: COLORS.authTextMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
    textAlign: "center",
  },
});
