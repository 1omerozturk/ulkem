import { View, Text, Animated, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import Lottie from "lottie-react-native";
import { styles } from "../assets/styles/quiz.styles";
import { FadeIn } from "react-native-reanimated";
import { useAuthStore } from "../store/authStore";

export default function ResultScreen({
  score,
  startGame,
  confettiRef,
  quizData,
}) {
  const { user, updateUserScore } = useAuthStore();
  const hasSavedStats = useRef(false);

  const handleUpdateUserStats = useCallback(async () => {
    if (!user || hasSavedStats.current) return;

    hasSavedStats.current = true;
    await updateUserScore(score, quizData);
  }, [quizData, score, updateUserScore, user]);

  useEffect(() => {
    handleUpdateUserStats();
  }, [handleUpdateUserStats]);

  const router = useRouter();
  return (
    <Animated.View
      style={styles.resultContainer}
      entering={FadeIn.duration(500)}
    >
      <Lottie
        ref={confettiRef}
        source={require("../assets/lottie/confetti.json")}
        autoPlay={score > 50}
        loop={score > 50}
        style={styles.lottieConfetti}
      />
      <Text style={styles.resultTitle}>Quiz Tamamlandı!</Text>
      <View style={styles.scoreCircle}>
        <Text style={styles.resultScoreText}>{score}</Text>
        <Text style={styles.scoreLabel}>Puan</Text>
      </View>
      <Text style={styles.resultText}>
        {score >= 80
          ? "Mükemmel! 🎉"
          : score >= 50
          ? "İyi iş! 👍"
          : "Daha çok çalışmalısın 😊"}
      </Text>
      <TouchableOpacity style={styles.restartButton} onPress={startGame}>
        <Text style={styles.restartButtonText}>TEKRAR OYNA</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>KATEGORİLER</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
