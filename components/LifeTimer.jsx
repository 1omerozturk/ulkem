import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { COLORS } from "../constants/Colors";
import { useAuthStore } from "../store/authStore";
import styles from "../assets/styles/life.styles";

export default function LifeTimer() {
  const lives = useAuthStore((state) => state.user?.lives ?? 0);
  const getRemainingTimeForNextLife = useAuthStore(
    (state) => state.getRemainingTimeForNextLife,
  );
  const refreshLivesIfNeeded = useAuthStore(
    (state) => state.refreshLivesIfNeeded,
  );
  const [timeLeft, setTimeLeft] = useState(getRemainingTimeForNextLife());
  const refreshInProgress = useRef(false);

  useEffect(() => {
    const refreshIfReady = async () => {
      if (lives >= 10 || refreshInProgress.current) return;
      refreshInProgress.current = true;
      try {
        await refreshLivesIfNeeded();
      } finally {
        refreshInProgress.current = false;
      }
    };

    refreshIfReady();
    const interval = setInterval(() => {
      const remaining = getRemainingTimeForNextLife();
      setTimeLeft(remaining);
      if (remaining === "00:00") refreshIfReady();
    }, 1000);
    return () => clearInterval(interval);
  }, [getRemainingTimeForNextLife, lives, refreshLivesIfNeeded]);

  const isFull = lives >= 10;

  return (
    <View style={styles.timerCard}>
      <View style={styles.timerIcon}>
        <Ionicons
          name={isFull ? "checkmark-circle" : "time-outline"}
          size={23}
          color={isFull ? COLORS.authSuccess : COLORS.menuWorldAccent}
        />
      </View>
      <View style={styles.timerCopy}>
        <Text style={styles.timerTitle}>
          {isFull ? "Canların hazır" : "Sıradaki canın"}
        </Text>
        <Text style={styles.timerSubtitle}>
          {isFull ? "Tüm canların dolu." : "Yeni can için kalan süre"}
        </Text>
      </View>
      <Text style={[styles.timerValue, isFull && styles.timerValueFull]}>
        {isFull ? "10/10" : timeLeft}
      </Text>
    </View>
  );
}
