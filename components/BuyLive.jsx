import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../constants/Colors";
import styles from "../assets/styles/buy-live.styles";
import Loading from "./Loading";

const LIFE_COST = 500;

export default function BuyLive() {
  const user = useAuthStore((state) => state.user);
  const buyLife = useAuthStore((state) => state.buyLife);
  const [isBuying, setIsBuying] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!user) return null;

  const hasMaxLives = user.lives >= 10;
  const hasEnoughPoints = user.score >= LIFE_COST;
  const isDisabled = isBuying || hasMaxLives || !hasEnoughPoints;

  const handleBuy = async () => {
    if (isDisabled) return;

    setIsBuying(true);
    setFeedback(null);
    try {
      const success = await buyLife();
      setFeedback(
        success
          ? { type: "success", text: "1 can eklendi. İyi eğlenceler!" }
          : { type: "error", text: "Can alınamadı. Bilgilerini kontrol edip tekrar dene." },
      );
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeading}>
        <View style={styles.heartBadge}>
          <Ionicons name="heart" size={22} color={COLORS.authError} />
        </View>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>Puanla can kazan</Text>
          <Text style={styles.description}>500 puan karşılığında 1 can</Text>
        </View>
      </View>

      <View style={styles.balanceRow}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Mevcut can</Text>
          <View style={styles.balanceValueRow}>
            <Ionicons name="heart" size={17} color={COLORS.authError} />
            <Text style={styles.balanceValue}>{user.lives} / 10</Text>
          </View>
        </View>
        <View style={styles.balanceDivider} />
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Puanın</Text>
          <View style={styles.balanceValueRow}>
            <Ionicons name="trophy" size={17} color={COLORS.authAccent} />
            <Text style={styles.balanceValue}>
              {user.score.toLocaleString("tr-TR")}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleBuy}
        disabled={isDisabled}
        activeOpacity={0.82}
        accessibilityState={{ busy: isBuying, disabled: isDisabled }}
        accessibilityRole="button"
        accessibilityLabel={`500 puan karşılığında 1 can al. Mevcut puan ${user.score}`}
      >
        {isBuying ? (
          <Loading compact message="Can satın alınıyor" />
        ) : (
          <>
            <Ionicons name="add-circle-outline" size={21} color={COLORS.white} />
            <Text style={styles.buttonText}>500 puanla 1 can al</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.helperText}>
        {hasMaxLives
          ? "Canların dolu. Yeni bir quiz için hazırsın!"
          : !hasEnoughPoints
            ? `${(LIFE_COST - user.score).toLocaleString("tr-TR")} puan daha kazan, sonra can alabilirsin.`
            : "Canların zamanla da yenilenir."}
      </Text>

      {feedback ? (
        <Text
          accessibilityLiveRegion="polite"
          style={
            feedback.type === "success" ? styles.successMessage : styles.errorMessage
          }
        >
          {feedback.text}
        </Text>
      ) : null}
    </View>
  );
}
