import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useAuthStore } from "../store/authStore";
import { GAME_RULES } from "../constants/GameConfig";
import { createStyles } from "../assets/styles/buy-live.styles";
import Loading from "./Loading";
import { useAppTheme } from "../hooks/useAppTheme";

export default function BuyLive() {
  const { colors: COLORS, styles } = useAppTheme(createStyles);
  const user = useAuthStore((state) => state.user);
  const buyLife = useAuthStore((state) => state.buyLife);
  const [isBuying, setIsBuying] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const hasMissingLives = Boolean(user && user.lives < GAME_RULES.maxLives);
  const isExpoGo = Constants.appOwnership === "expo";
  const canLoadNativeAds = Platform.OS !== "web" && !isExpoGo;
  // This module imports a native AdMob TurboModule. Keep it unevaluated inside Expo Go.
  const RewardedLifeAd = canLoadNativeAds ? require("./RewardedLifeAd").default : null;

  if (!user) return null;

  const hasMaxLives = user.lives >= GAME_RULES.maxLives;
  const hasEnoughPoints = user.score >= GAME_RULES.lifePurchaseCost;
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
          <Text style={styles.title}>Canlarını yenile</Text>
          <Text style={styles.description}>
            {hasMaxLives
              ? "Canların dolu. Yeni bir keşfe hazırsın!"
              : "İstersen reklamla hemen 1 can kazanabilir ya da puan kullanabilirsin."}
          </Text>
        </View>
      </View>

      <View style={styles.balanceRow}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Mevcut can</Text>
          <View style={styles.balanceValueRow}>
            <Ionicons name="heart" size={17} color={COLORS.authError} />
            <Text style={styles.balanceValue}>{user.lives} / {GAME_RULES.maxLives}</Text>
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

      {hasMissingLives ? (
        !canLoadNativeAds ? (
          <View style={styles.rewardedAdSection}>
            <Text style={styles.rewardedAdHint}>
              Ödüllü reklamı tamamladığında 1 can kazanabilirsin. Reklam özelliği bu test ortamında kullanılamıyor.
            </Text>
          </View>
        ) : (
          <View style={styles.featuredReward}>
            <View style={styles.featuredRewardCopy}>
              <View style={styles.featuredRewardTitleRow}>
                <Ionicons name="sparkles" size={16} color={COLORS.authAccent} />
                <Text style={styles.featuredRewardTitle}>Hemen 1 can kazan</Text>
              </View>
              <Text style={styles.featuredRewardSubtitle}>İsteğe bağlı ödüllü reklam</Text>
            </View>
            <RewardedLifeAd
              featured
              showDivider={false}
              onReward={async () => {
                const rewarded = await useAuthStore.getState().earnLifeFromRewardedAd();
                setFeedback(rewarded
                  ? { type: "success", text: "Reklamı tamamladın. 1 can eklendi!" }
                  : { type: "error", text: "Canların dolmuş olabilir. Can durumunu yenileyip kontrol et." });
              }}
            />
          </View>
        )
      ) : null}

      <TouchableOpacity
        style={[styles.button, hasMissingLives && styles.buttonSecondary, isDisabled && styles.buttonDisabled]}
        onPress={handleBuy}
        disabled={isDisabled}
        activeOpacity={0.82}
        accessibilityState={{ busy: isBuying, disabled: isDisabled }}
        accessibilityRole="button"
        accessibilityLabel={`${GAME_RULES.lifePurchaseCost} puan karşılığında 1 can al. Mevcut puan ${user.score}`}
      >
        {isBuying ? (
          <Loading compact message="Can satın alınıyor" />
        ) : (
          <>
            <Ionicons name="add-circle-outline" size={21} color={hasMissingLives ? COLORS.authPrimary : COLORS.white} />
            <Text style={[styles.buttonText, hasMissingLives && styles.buttonTextSecondary]}>{GAME_RULES.lifePurchaseCost} puanla 1 can al</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.helperText}>
        {hasMaxLives
          ? "Canların dolu. Yeni bir quiz için hazırsın!"
          : !hasEnoughPoints
            ? `${(GAME_RULES.lifePurchaseCost - user.score).toLocaleString("tr-TR")} puan daha kazan, sonra can alabilirsin.`
            : "Canların zamanla da yenilenir."}
      </Text>

      {feedback ? (
        <Text
          accessibilityLiveRegion="polite"
          style={feedback.type === "success" ? styles.successMessage : styles.errorMessage}
        >
          {feedback.text}
        </Text>
      ) : null}
    </View>
  );
}
