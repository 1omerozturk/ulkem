import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants/Colors";

type TimerBarProps = {
  duration: number;
  remainingSeconds: number;
  resetTrigger?: number;
  paused?: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function TimerBar({
  duration,
  remainingSeconds,
  resetTrigger = 0,
  paused = false,
}: TimerBarProps) {
  const durationSeconds = Math.max(1, Math.ceil(duration / 1000));
  const progress = useSharedValue(1);
  const lastResetTrigger = useRef(resetTrigger);
  const isUrgent = remainingSeconds <= 5;

  useEffect(() => {
    cancelAnimation(progress);

    if (lastResetTrigger.current !== resetTrigger) {
      lastResetTrigger.current = resetTrigger;
      progress.value = 1;
      return;
    }

    const nextProgress = clamp(remainingSeconds / durationSeconds, 0, 1);
    if (paused) {
      progress.value = nextProgress;
      return;
    }

    const distance = Math.abs(progress.value - nextProgress);
    if (distance === 0) return;

    progress.value = withTiming(nextProgress, {
      duration: Math.max(80, Math.min(1000, distance * duration)),
      easing: Easing.linear,
    });

    return () => cancelAnimation(progress);
  }, [duration, durationSeconds, paused, progress, remainingSeconds, resetTrigger]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 0.22, 0.58, 1],
      [COLORS.authError, "#E6A23A", "#8EAF69", COLORS.authPrimary],
    ),
  }));

  return (
    <View
      style={styles.panel}
      accessibilityRole="progressbar"
      accessibilityLabel={`Kalan süre ${remainingSeconds} saniye`}
      accessibilityValue={{ min: 0, max: durationSeconds, now: remainingSeconds }}
    >
      <View style={styles.labelRow}>
        <View style={styles.timerLabel}>
          <Ionicons
            name="hourglass-outline"
            size={15}
            color={isUrgent ? COLORS.authError : COLORS.authPrimary}
          />
          <Text style={styles.label}>SÜRE</Text>
        </View>
        <View style={[styles.timePill, isUrgent && styles.timePillUrgent]}>
          <Text style={[styles.timeText, isUrgent && styles.timeTextUrgent]}>
            {remainingSeconds} sn
          </Text>
        </View>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const styles = {
  panel: {
    paddingHorizontal: 13,
    paddingTop: 9,
    paddingBottom: 10,
    borderRadius: 17,
    backgroundColor: COLORS.authSurface,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
  },
  labelRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 7,
  },
  timerLabel: { flexDirection: "row" as const, alignItems: "center" as const, gap: 6 },
  label: { color: COLORS.authTextMuted, fontSize: 10, fontWeight: "900" as const, letterSpacing: 1 },
  timePill: { minWidth: 55, alignItems: "center" as const, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10, backgroundColor: COLORS.authPrimarySoft },
  timePillUrgent: { backgroundColor: "#F9E9E6" },
  timeText: { color: COLORS.authPrimary, fontSize: 12, fontWeight: "900" as const, fontVariant: ["tabular-nums"] as const },
  timeTextUrgent: { color: COLORS.authError },
  track: { height: 8, overflow: "hidden" as const, borderRadius: 4, backgroundColor: COLORS.authBorder },
  fill: { height: "100%" as const, borderRadius: 4 },
};
