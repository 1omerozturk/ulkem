import React, { useEffect, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import mobileAds, {
  AdsConsent,
  MaxAdContentRating,
  TestIds,
  useRewardedAd,
} from "react-native-google-mobile-ads";
import { createStyles } from "../assets/styles/buy-live.styles";
import { useAppTheme } from "../hooks/useAppTheme";

export default function RewardedLifeAd({
  onReward,
  rewardLabel = "1 can",
  disabled = false,
  featured = false,
  showDivider = true,
}) {
  const { colors: COLORS, styles } = useAppTheme(createStyles);
  const [isPreparingAd, setIsPreparingAd] = useState(true);
  const [canRequestAds, setCanRequestAds] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const rewardHandled = useRef(false);
  const rewardEarnedInSession = useRef(false);
  const onRewardRef = useRef(onReward);

  useEffect(() => {
    onRewardRef.current = onReward;
  }, [onReward]);

  const adUnitId = Platform.select({
    ios: process.env.EXPO_PUBLIC_ADMOB_IOS_REWARDED_ID || TestIds.REWARDED,
    android: process.env.EXPO_PUBLIC_ADMOB_ANDROID_REWARDED_ID || TestIds.REWARDED,
    default: TestIds.REWARDED,
  });
  const { status: adStatus, show: showRewardedAd, retry: retryRewardedAd, earnedReward } = useRewardedAd({
    adUnitId,
    autoLoad: canRequestAds,
  });

  useEffect(() => {
    let isActive = true;
    (async () => {
      const consent = await AdsConsent.gatherConsent();
      if (!consent.canRequestAds || !isActive) return;
      await mobileAds().setRequestConfiguration({ maxAdContentRating: MaxAdContentRating.PG });
      await mobileAds().initialize();
      if (isActive) setCanRequestAds(true);
    })()
      .catch((error) => {
        console.warn("AdMob başlatılamadı:", error);
        if (isActive) setFeedback({ type: "error", text: "Reklam şu an hazırlanamadı. Daha sonra tekrar deneyebilirsin." });
      })
      .finally(() => {
        if (isActive) setIsPreparingAd(false);
      });

    return () => { isActive = false; };
  }, []);

  useEffect(() => {
    if (adStatus === "showing") {
      rewardHandled.current = false;
      rewardEarnedInSession.current = false;
    }

    if (earnedReward && !rewardHandled.current) {
      rewardHandled.current = true;
      rewardEarnedInSession.current = true;
      onRewardRef.current();
    }

    if (adStatus === "closed" && !rewardEarnedInSession.current) {
      setFeedback({ type: "error", text: `${rewardLabel} kazanmak için ödüllü reklamı tamamlamalısın.` });
    }
  }, [adStatus, earnedReward, rewardLabel]);

  const handleRewardedAd = () => {
    setFeedback(null);
    if (adStatus === "loaded") {
      rewardHandled.current = false;
      rewardEarnedInSession.current = false;
      showRewardedAd();
    } else if (adStatus === "no-fill" || adStatus === "error") {
      retryRewardedAd();
    }
  };

  const adBusy = isPreparingAd || adStatus === "loading" || adStatus === "showing";
  const adUnavailable = disabled || !canRequestAds || !["loaded", "no-fill", "error"].includes(adStatus);
  const rewardedAdLabel = adBusy
    ? adStatus === "showing" ? "Reklam izleniyor…" : "Reklam hazırlanıyor…"
    : adStatus === "loaded"
      ? `Reklam izle · ${rewardLabel} kazan`
      : adStatus === "no-fill" || adStatus === "error"
        ? "Reklamı tekrar dene"
        : "Reklam şu an kullanılamıyor";

  return (
    <View style={styles.rewardedAdSection}>
      {showDivider ? <View style={styles.rewardedAdDivider}>
        <View style={styles.rewardedAdLine} />
        <Text style={styles.rewardedAdOr}>VEYA</Text>
        <View style={styles.rewardedAdLine} />
      </View> : null}
      <TouchableOpacity
        style={[
          styles.rewardedAdButton,
          featured && styles.rewardedAdButtonFeatured,
          adUnavailable && styles.rewardedAdButtonDisabled,
        ]}
        onPress={handleRewardedAd}
        disabled={adBusy || adUnavailable}
        activeOpacity={0.84}
        accessibilityRole="button"
        accessibilityLabel={`Ödüllü reklam izleyerek ${rewardLabel} kazan`}
      >
        <Ionicons name="play-circle" size={22} color={featured ? COLORS.authBackground : COLORS.authPrimary} />
        <Text style={[styles.rewardedAdButtonText, featured && styles.rewardedAdButtonTextFeatured]}>{rewardedAdLabel}</Text>
      </TouchableOpacity>
      <Text style={styles.rewardedAdHint}>
        {canRequestAds ? `Reklamı tamamladığında ${rewardLabel} hesabına eklenir.` : "Reklamları gösterebilmek için izin ve bağlantı gerekir."}
      </Text>
      {feedback ? <Text style={feedback.type === "success" ? styles.successMessage : styles.errorMessage}>{feedback.text}</Text> : null}
    </View>
  );
}
