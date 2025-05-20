import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TimerBar from "./TimerBar";
import Animated, {
  FadeIn,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
  SlideInUp,
  FadeInRight,
  FadeInLeft,
  FadeOut,
  SlideInDown,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import Lottie from "lottie-react-native";
import { quizService } from "../service/quizService";
import { COLORS } from "../constants/Colors";
import { styles } from "../assets/styles/quiz.styles";
import { router } from "expo-router";

export default function QuizScreen({ type }) {
  const [resetTimerKey, setResetTimerKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);

  const timerRef = useRef(null);
  const progressAnim = useSharedValue(0);
  const confettiRef = useRef(null);

  const startGame = () => {
    let newQuestions;
    switch (type) {
      case "district":
        newQuestions = quizService.generateDistrictQuestions();
        break;
      case "region":
        newQuestions = quizService.generateRegionQuestions();
        break;

      case "plate":
        newQuestions = quizService.generatePlateQuestions();
        break;

      default:
        break;
    }
    setQuestions(newQuestions);
    setGameStarted(true);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(20);
    setResetTimerKey((prev) => prev + 1);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          runOnJS(nextQuestion)();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentQuestion((prev) => prev + 1);
    setTimeLeft(20);
    setResetTimerKey((prev) => prev + 1);
  }, []);

  const handleAnswer = (index) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion]?.correctAnswer) {
      setScore((prev) => prev + 10);
      confettiRef.current?.play();
    }

    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  useEffect(() => {
    if (gameStarted && questions.length && currentQuestion < questions.length) {
      resetTimer();
      progressAnim.value = withTiming(1, { duration: 20000 });
    }
  }, [gameStarted, currentQuestion]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  if (!gameStarted) {
    return (
      <Animated.View
        style={styles.startContainer}
        entering={FadeIn.duration(500)}
      >
        <Lottie
          source={require("../assets/lottie/quiz.json")}
          autoPlay
          loop
          style={styles.lottieStart}
        />
        <Text style={styles.startTitle}>Plaka Bilgi Yarışması</Text>
        <Text style={styles.startSubtitle}>
          Türkiye'nin şehir plakalarını ne kadar iyi biliyorsun?
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>BAŞLA</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (currentQuestion >= questions.length) {
    return (
      <Animated.View
        style={styles.resultContainer}
        entering={FadeIn.duration(500)}
      >
        <Lottie
          ref={confettiRef}
          source={require("../assets/lottie/confetti.json")}
          autoPlay={score > 50}
          loop={false}
          style={styles.lottieConfetti}
        />
        <Text style={styles.resultTitle}>Quiz Tamamlandı!</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{score}</Text>
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>KATEGORİLER</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const alphabet = ["A", "B", "C", "D", "E"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.Text
          key={currentQuestion}
          entering={SlideInDown.delay(100)
            .springify()
            .damping(15)
            .stiffness(120)}
          exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}
          style={styles.questionCounter}
        >
          {currentQuestion + 1}
          <Text>{" / " + questions.length}</Text>
        </Animated.Text>

        <Text style={styles.scoreText}>Puan: {score}</Text>

        <Animated.View
          entering={ZoomIn.duration(500)}
          exiting={ZoomOut.duration(300)}
          style={styles.timerContainer}
        >
          <Text style={styles.timerText}>{timeLeft}</Text>
        </Animated.View>
      </View>

      <View style={styles.progressBarContainer}>
        <TimerBar duration={20000} resetTrigger={resetTimerKey} />
      </View>

      <Animated.View
        key={`question-${currentQuestion}`}
        entering={SlideInUp.delay(100).springify().damping(20).stiffness(150)}
        exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}
        style={styles.questionContainer}
      >
        <Text style={styles.questionText}>
          <Text style={styles.plateCode}>
            {questions[currentQuestion]?.plate
              ? questions[currentQuestion].plate
              : questions[currentQuestion].city
              ? questions[currentQuestion].city
              : questions[currentQuestion].cityName}
          </Text>{" "}
          <Text
            style={
              questions[currentQuestion]?.type
                ? styles.positiveQuestion
                : styles.negativeQuestion
            }
          >
            {questions[currentQuestion].question}
          </Text>
        </Text>
      </Animated.View>

      <View style={styles.optionsContainer}>
        {questions[currentQuestion]?.options.map((option, index) => {
          const isCorrect = index === questions[currentQuestion]?.correctAnswer;
          const isSelected = index === selectedAnswer;

          let bgColor = COLORS.cardBackground;
          if (isAnswered) {
            if (isCorrect) bgColor = "#4CAF50";
            else if (isSelected) bgColor = "#F44336";
          }

          return (
            <Animated.View
              key={`${
                questions[currentQuestion]?.plate ??
                questions[currentQuestion]?.city ??
                questions[currentQuestion]?.cityName ??
                "no-key"
              }-${index}`}
              entering={
                index % 2 === 0
                  ? FadeInLeft.duration(400)
                      .springify()
                      .damping(20)
                      .stiffness(150)
                  : FadeInRight.duration(400)
                      .springify()
                      .damping(20)
                      .stiffness(150)
              }
              exiting={FadeOut.duration(300).easing(
                Easing.inOut(Easing.linear)
              )}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleAnswer(index)}
                disabled={isAnswered}
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isAnswered
                      ? isCorrect
                        ? "#4CAF50" // Doğru cevap yeşil
                        : isSelected
                        ? "#F44336" // Yanlış cevap kırmızı
                        : COLORS.cardBackground
                      : COLORS.cardBackground,
                    transform: [{ scale: isSelected ? 1.05 : 1 }], // Seçildiğinde hafif büyütme efekti
                  },
                ]}
              >
                <Animated.View
                  entering={FadeIn.duration(300)}
                  exiting={FadeOut.duration(300)}
                  style={styles.optionTouchable}
                >
                  <View style={styles.optionView}>
                    <Text style={styles.alphabetText}>
                      {alphabet[index] + ".)"}
                    </Text>
                    <Text style={styles.optionText}>{option}</Text>
                  </View>

                  {isSelected && (
                    <Lottie
                      speed={1.75}
                      source={
                        isCorrect
                          ? require(`../assets/lottie/success.json`)
                          : require(`../assets/lottie/error.json`)
                      }
                      autoPlay
                      loop={false}
                      style={styles.optionLottie}
                    />
                  )}
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
