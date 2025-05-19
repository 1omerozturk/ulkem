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
  FadeInRight,
  FadeInLeft,
  FadeOut,
  SlideInDown,
  ZoomIn,
  ZoomOut,
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

  const generatePlateQuestions = () => {
    const shuffled = [...citiesData.data].sort(() => 0.5 - Math.random());
    const selectedCities = new Set(); // Seçilen şehirleri takip eden küme

    return shuffled
      .filter((city) => {
        if (selectedCities.has(city.id)) return false; // Aynı şehir tekrar eklenmesin
        selectedCities.add(city.id);
        return true;
      })
      .slice(0, 10)
      .map((city) => {
        const wrongOptions = citiesData.data
          .filter((c) => c.id !== city.id)
          .sort(() => 0.5 - Math.random())
          .map((c) => c.name);

        const uniqueOptions = new Set([city.name]); // Seçeneklerin benzersiz olmasını sağla

        wrongOptions.forEach((option) => {
          if (uniqueOptions.size < 4) uniqueOptions.add(option); // Aynı seçenek eklenmesin
        });

        const options = [...uniqueOptions].sort(() => 0.5 - Math.random());

        return {
          city: city.name,
          plate: city.id.toString(),
          options,
          correctAnswer: options.indexOf(city.name),
        };
      });
  };

  const generateRegionQuestions = () => {
    const shuffled = [...citiesData.data].sort(() => 0.5 - Math.random());
    const selectedRegions = new Set(); // Seçilen bölgeleri takip eden küme

    return shuffled
      .filter((city) => {
        if (selectedRegions.has(city.region.tr)) return false; // Aynı bölge tekrar eklenmesin
        selectedRegions.add(city.region.tr);
        return true;
      })
      .slice(0, 10)
      .map((city) => {
        const wrongOptions = citiesData.data
          .filter((c) => c.region.tr !== city.region.tr)
          .sort(() => 0.5 - Math.random())
          .map((c) => c.region.tr);

        const uniqueOptions = new Set([city.region.tr]); // Seçeneklerin benzersiz olmasını sağla

        wrongOptions.forEach((option) => {
          if (uniqueOptions.size < 4) uniqueOptions.add(option);
        });

        const options = [...uniqueOptions].sort(() => 0.5 - Math.random());

        return {
          city: city.name,
          options,
          correctAnswer: options.indexOf(city.region.tr),
        };
      });
  };

  const startGame = () => {
    const newQuestions = generateRegionQuestions();
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
        <Animated.View
          style={[
            styles.progressBar,
            { width: `${progressAnim.value * 100}%` },
          ]}
        />
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
              : questions[currentQuestion].city}
          </Text>{" "}
          {questions[currentQuestion]?.plate
            ? "plaka kodu hangi ilimize aittir?"
            : "ili hangi bölgemizdedir?"}
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
              key={`${questions[currentQuestion]?.city}-${index}`}
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
              exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.linear))}
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
                          ? require(`../../assets/lottie/success2.json`)
                          : require(`../../assets/lottie/error2.json`)
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
