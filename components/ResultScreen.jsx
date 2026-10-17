import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Lottie from "lottie-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import Constants from "expo-constants";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { createStyles } from "../assets/styles/quiz.styles";
import { GAME_RULES } from "../constants/GameConfig";
import { useAuthStore } from "../store/authStore";
import { useGameAudio } from "./GameAudioProvider";
import { useAppTheme } from "../hooks/useAppTheme";

export default function ResultScreen({
  score,
  startGame,
  confettiRef,
  quizData,
  quizTitle,
  totalQuestions,
  comboBonusTotal = 0,
  speedBonusTotal = 0,
  bestCombo = 0,
  onChooseCategory,
}) {
  const { colors, styles } = useAppTheme(createStyles);
  const { user, updateUserScore, addBonusScore } = useAuthStore();
  const hasSavedStats = useRef(false);
  const statsSavePromise = useRef(null);
  const hasPlayedCompletionHaptic = useRef(false);
  const hasClaimedDoubleRef = useRef(false);
  const [hasDoubledPoints, setHasDoubledPoints] = useState(false);
  const [doublingError, setDoublingError] = useState("");
  const { vibrate } = useGameAudio();
  const isExpoGo = Constants.appOwnership === "expo";
  const canLoadNativeAds = Platform.OS !== "web" && !isExpoGo;
  const RewardedLifeAd = canLoadNativeAds ? require("./RewardedLifeAd").default : null;
  const correctAnswers = quizData?.true_number || 0;
  const wrongAnswers = quizData?.false_number || 0;
  const accuracy = totalQuestions
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;
  const totalBonus = comboBonusTotal + speedBonusTotal;

  const handleUpdateUserStats = useCallback(async () => {
    if (!user || hasSavedStats.current) return;

    hasSavedStats.current = true;
    statsSavePromise.current = updateUserScore(score, quizData);
    const saved = await statsSavePromise.current;
    if (!saved) hasSavedStats.current = false;
  }, [quizData, score, updateUserScore, user]);

  useEffect(() => {
    handleUpdateUserStats();
  }, [handleUpdateUserStats]);

  useEffect(() => {
    if (hasPlayedCompletionHaptic.current) return;
    hasPlayedCompletionHaptic.current = true;
    vibrate("success");
  }, [vibrate]);

  const handleDoublePointsReward = async () => {
    if (hasClaimedDoubleRef.current || hasDoubledPoints || score <= 0) return;
    hasClaimedDoubleRef.current = true;
    setDoublingError("");
    const statsSaved = await statsSavePromise.current;
    if (!statsSaved) {
      hasClaimedDoubleRef.current = false;
      setDoublingError("Tur puanları henüz kaydedilemedi. Biraz bekleyip tekrar deneyebilirsin.");
      return;
    }
    const saved = await addBonusScore(score);
    if (saved) setHasDoubledPoints(true);
    else {
      hasClaimedDoubleRef.current = false;
      setDoublingError("Bonus puan eklenemedi. Bağlantını kontrol edip tekrar deneyebilirsin.");
    }
  };

  const resultMessage = accuracy >= 80
    ? { title: "Harika keşif!", subtitle: "Bilgin pusulan gibi doğru yönü gösteriyor.", icon: "trophy" }
    : accuracy >= 50
      ? { title: "Güzel ilerleme!", subtitle: "Her turda yeni şeyler öğreniyorsun.", icon: "sparkles" }
      : { title: "Keşif devam ediyor", subtitle: "Bir tur daha oynayıp bilgini güçlendirebilirsin.", icon: "compass" };

  return (
    <View style={styles.resultContainer}>
      <LinearGradient
            colors={[colors.authPrimarySoft, colors.authSurface, `${colors.authAccent}22`]}
        locations={[0, 0.55, 1]}
        style={styles.resultBackdrop}
      />
      <Animated.ScrollView
        style={styles.resultScroll}
        contentContainerStyle={styles.resultContent}
        showsVerticalScrollIndicator={false}
        entering={FadeIn.duration(450)}
      >
        <View style={styles.resultTopline}>
          <View style={styles.resultBrandPill}>
            <Ionicons name="compass" size={15} color={colors.authPrimary} />
            <Text style={styles.resultBrandText}>YURTPUSULA</Text>
          </View>
          <View style={styles.resultDonePill}>
            <Ionicons name="checkmark-circle" size={15} color={colors.authSuccess} />
            <Text style={styles.resultDoneText}>TUR TAMAMLANDI</Text>
          </View>
        </View>

        <View style={styles.resultHero}>
          <Lottie
            ref={confettiRef}
            source={require("../assets/lottie/confetti.json")}
            autoPlay={score >= GAME_RULES.pointsPerCorrectAnswer * 5}
            loop={false}
            style={styles.lottieConfetti}
          />
          <Animated.View entering={FadeInDown.delay(100).duration(450)} style={styles.resultMedallion}>
            <Ionicons name={resultMessage.icon} size={32} color="#FFF9E9" />
          </Animated.View>
          <Text style={styles.resultTitle}>{resultMessage.title}</Text>
          <Text style={styles.resultQuizName}>{quizTitle}</Text>
          <Text style={styles.resultText}>{resultMessage.subtitle}</Text>
        </View>

        <View style={styles.resultScoreCard}>
          <View style={styles.resultScoreHeader}>
            <View>
              <Text style={styles.resultScoreCaption}>{hasDoubledPoints ? "REKLAM ÖDÜLÜYLE TOPLAM" : "BU TURDA KAZANDIN"}</Text>
              <View style={styles.resultScoreLine}>
                <Text style={styles.resultScoreText}>{hasDoubledPoints ? score * 2 : score}</Text>
                <Text style={styles.resultScoreUnit}>puan</Text>
              </View>
            </View>
            <View style={styles.resultAccuracyBadge}>
              <Text style={styles.resultAccuracyValue}>{accuracy}%</Text>
              <Text style={styles.resultAccuracyLabel}>DOĞRULUK</Text>
            </View>
          </View>
          <View style={styles.resultStatsDivider} />
          <View style={styles.resultStatsRow}>
            <View style={styles.resultStatItem}>
              <View style={[styles.resultStatIcon, styles.resultCorrectIcon]}>
                <Ionicons name="checkmark" size={15} color={colors.authSuccess} />
              </View>
              <Text style={styles.resultStatValue}>{correctAnswers}</Text>
              <Text style={styles.resultStatLabel}>DOĞRU</Text>
            </View>
            <View style={styles.resultStatItem}>
              <View style={[styles.resultStatIcon, styles.resultWrongIcon]}>
                <Ionicons name="close" size={15} color={colors.authError} />
              </View>
              <Text style={styles.resultStatValue}>{wrongAnswers}</Text>
              <Text style={styles.resultStatLabel}>YANLIŞ</Text>
            </View>
            <View style={styles.resultStatItem}>
              <View style={[styles.resultStatIcon, styles.resultQuestionIcon]}>
                <Ionicons name="help" size={15} color={colors.authAccent} />
              </View>
              <Text style={styles.resultStatValue}>{totalQuestions}</Text>
              <Text style={styles.resultStatLabel}>SORU</Text>
            </View>
          </View>
          <View style={styles.resultBonusPanel}>
            <View style={styles.resultBonusHeading}>
              <Text style={styles.resultBonusCaption}>KOMBO ÖDÜLLERİ</Text>
              <Text style={styles.resultBonusTotal}>+{totalBonus}</Text>
            </View>
            <Text style={styles.resultBonusDetail}>
              En iyi combo x{bestCombo}  ·  Seri +{comboBonusTotal}  ·  Hız +{speedBonusTotal}
            </Text>
          </View>
        </View>

        <View style={styles.resultActions}>
          {score > 0 && !hasDoubledPoints ? (
            <View style={styles.resultDoubleCard}>
              <View style={styles.resultDoubleHeader}>
                <View style={styles.resultDoubleIcon}>
                  <Ionicons name="sparkles" size={19} color={colors.authPrimary} />
                </View>
                <View style={styles.resultDoubleCopy}>
                  <Text style={styles.resultDoubleTitle}>Tur bonusunu al</Text>
                  <Text style={styles.resultDoubleDescription}>İstersen kısa bir reklam izleyip puanını ikiye katla.</Text>
                </View>
              </View>
              <View style={styles.resultDoublePrize}>
                <Ionicons name="trophy" size={16} color={colors.authPrimary} />
                <Text style={styles.resultDoublePrizeText}>+{score.toLocaleString("tr-TR")} bonus puan</Text>
                <View style={styles.resultDoubleMultiplier}>
                  <Text style={styles.resultDoubleMultiplierText}>×2</Text>
                </View>
              </View>
              {canLoadNativeAds ? (
                <RewardedLifeAd
                  rewardLabel={`${score.toLocaleString("tr-TR")} puan`}
                  disabled={hasDoubledPoints}
                  featured
                  showDivider={false}
                  onReward={handleDoublePointsReward}
                />
              ) : (
                <Text style={styles.resultDoubleUnavailable}>
                  Ödüllü reklam bu test ortamında kullanılamıyor; özel test APK’sında deneyebilirsin.
                </Text>
              )}
              {!!doublingError && <Text style={styles.resultDoubleError}>{doublingError}</Text>}
              <Text style={styles.resultDoubleFootnote}>İsteğe bağlı · bu turda bir kez</Text>
            </View>
          ) : hasDoubledPoints ? (
            <View style={{ minHeight: 42, borderRadius: 14, backgroundColor: `${colors.authSuccess}22`, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Ionicons name="checkmark-circle" size={18} color={colors.authSuccess} />
              <Text style={{ color: colors.authSuccess, fontSize: 12, fontWeight: "900" }}>Puanın ikiye katlandı · +{score} puan</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.restartButton}
            onPress={startGame}
            activeOpacity={0.86}
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={19} color={colors.white} />
            <Text style={styles.restartButtonText}>AYNI QUIZİ TEKRAR OYNA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoriesButton}
            onPress={onChooseCategory}
            activeOpacity={0.82}
            accessibilityRole="button"
          >
            <Ionicons name="grid-outline" size={18} color={colors.authPrimary} />
            <Text style={styles.categoriesButtonText}>BAŞKA BİR KEŞİF SEÇ</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.authPrimary} />
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
