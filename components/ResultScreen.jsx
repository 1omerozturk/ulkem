import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Lottie from "lottie-react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { styles } from "../assets/styles/quiz.styles";
import { GAME_RULES } from "../constants/GameConfig";
import { useAuthStore } from "../store/authStore";
import { useGameAudio } from "./GameAudioProvider";

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
  const { user, updateUserScore } = useAuthStore();
  const hasSavedStats = useRef(false);
  const hasPlayedCompletionHaptic = useRef(false);
  const { vibrate } = useGameAudio();
  const correctAnswers = quizData?.true_number || 0;
  const wrongAnswers = quizData?.false_number || 0;
  const accuracy = totalQuestions
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;
  const totalBonus = comboBonusTotal + speedBonusTotal;

  const handleUpdateUserStats = useCallback(async () => {
    if (!user || hasSavedStats.current) return;

    hasSavedStats.current = true;
    await updateUserScore(score, quizData);
  }, [quizData, score, updateUserScore, user]);

  useEffect(() => {
    handleUpdateUserStats();
  }, [handleUpdateUserStats]);

  useEffect(() => {
    if (hasPlayedCompletionHaptic.current) return;
    hasPlayedCompletionHaptic.current = true;
    vibrate("success");
  }, [vibrate]);

  const resultMessage = accuracy >= 80
    ? { title: "Harika keşif!", subtitle: "Bilgin pusulan gibi doğru yönü gösteriyor.", icon: "trophy" }
    : accuracy >= 50
      ? { title: "Güzel ilerleme!", subtitle: "Her turda yeni şeyler öğreniyorsun.", icon: "sparkles" }
      : { title: "Keşif devam ediyor", subtitle: "Bir tur daha oynayıp bilgini güçlendirebilirsin.", icon: "compass" };

  return (
    <View style={styles.resultContainer}>
      <LinearGradient
        colors={["#E6F1EA", "#F5F7F3", "#F4F0E8"]}
        locations={[0, 0.55, 1]}
        style={styles.resultBackdrop}
      />
      <Animated.View style={styles.resultContent} entering={FadeIn.duration(450)}>
        <View style={styles.resultTopline}>
          <View style={styles.resultBrandPill}>
            <Ionicons name="compass" size={15} color="#26745C" />
            <Text style={styles.resultBrandText}>YURTPUSULA</Text>
          </View>
          <View style={styles.resultDonePill}>
            <Ionicons name="checkmark-circle" size={15} color="#26745C" />
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
              <Text style={styles.resultScoreCaption}>BU TURDA KAZANDIN</Text>
              <View style={styles.resultScoreLine}>
                <Text style={styles.resultScoreText}>{score}</Text>
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
                <Ionicons name="checkmark" size={15} color="#26745C" />
              </View>
              <Text style={styles.resultStatValue}>{correctAnswers}</Text>
              <Text style={styles.resultStatLabel}>DOĞRU</Text>
            </View>
            <View style={styles.resultStatItem}>
              <View style={[styles.resultStatIcon, styles.resultWrongIcon]}>
                <Ionicons name="close" size={15} color="#B9554F" />
              </View>
              <Text style={styles.resultStatValue}>{wrongAnswers}</Text>
              <Text style={styles.resultStatLabel}>YANLIŞ</Text>
            </View>
            <View style={styles.resultStatItem}>
              <View style={[styles.resultStatIcon, styles.resultQuestionIcon]}>
                <Ionicons name="help" size={15} color="#B77825" />
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
          <TouchableOpacity
            style={styles.restartButton}
            onPress={startGame}
            activeOpacity={0.86}
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={19} color="#FFFFFF" />
            <Text style={styles.restartButtonText}>AYNI QUIZİ TEKRAR OYNA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoriesButton}
            onPress={onChooseCategory}
            activeOpacity={0.82}
            accessibilityRole="button"
          >
            <Ionicons name="grid-outline" size={18} color="#26745C" />
            <Text style={styles.categoriesButtonText}>BAŞKA BİR KEŞİF SEÇ</Text>
            <Ionicons name="arrow-forward" size={16} color="#26745C" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
