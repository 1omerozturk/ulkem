import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
  FadeInDown,
  FadeInUp,
  SlideInUp,
} from "react-native-reanimated";
import Lottie from "lottie-react-native";
import citiesData from "../../model/data.json";
import { COLORS } from "@/constants/Colors";
import { styles } from "../../assets/styles/quiz.styles";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
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

  const generateQuestions = () => {
    const shuffled = [...citiesData.data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10).map((city) => {
      const wrongOptions = citiesData.data
        .filter((c) => c.id !== city.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((c) => c.name);

      const options = [...wrongOptions, city.name].sort(
        () => 0.5 - Math.random()
      );

      return {
        city: city.name,
        plate: city.id.toString(),
        options,
        correctAnswer: options.indexOf(city.name),
      };
    });
  };

  const startGame = () => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setGameStarted(true);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(20);
    progressAnim.value = 0;
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
    progressAnim.value = 0;
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
          source={require("../../assets/lottie/quiz.json")}
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
          source={require("../../assets/lottie/confetti.json")}
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
      </Animated.View>
    );
  }

  const alphabet = ["A", "B", "C", "D", "E"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Puan: {score}</Text>
        <Text style={styles.timerText}>{timeLeft}</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            { width: `${progressAnim.value * 100}%` },
          ]}
        />
      </View>

      <Animated.View
        key={`question-${currentQuestion}`}
        entering={SlideInUp.delay(100)}
        style={styles.questionContainer}
      >
        <Text style={styles.questionText}>
          <Text style={styles.plateCode}>
            {questions[currentQuestion]?.plate}
          </Text>{" "}
          plaka kodu hangi şehre aittir?
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
            <TouchableOpacity
              onPress={() => handleAnswer(index)}
              disabled={isAnswered}
              key={index}
              style={[styles.optionButton, { backgroundColor: bgColor }]}
            >
              <View style={styles.optionTouchable}>
                <View style={styles.optionView}>
                  <Text style={styles.alphabetText}> {alphabet[index]}.</Text>
                  <Text style={styles.optionText}>{option}</Text>
                </View>
                {isSelected && (
                  <Lottie
                    source={
                      isCorrect
                        ? require(`../../assets/lottie/success2.json`)
                        : require(`../../assets/lottie/error2.json`)
                    }
                    autoPlay
                    loop={false}
                    style={styles.optionLottie}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
