import { goBack } from "expo-router/build/global-state/routing";
import Lottie from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutUp,
  runOnJS,
  SlideInDown,
  SlideInUp,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { styles } from "../assets/styles/quiz.styles";
import { COLORS } from "../constants/Colors";
import { quizService } from "../service/quizService";
import { useAuthStore } from "../store/authStore";
import ResultScreen from "./ResultScreen";
import TimerBar from "./TimerBar";

export default function QuizScreen({ type }) {
  const [resetTimerKey, setResetTimerKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [quizData, setQuizData] = useState({
    quiz_number: 0,
    question_number: 0,
    true_number: 0,
    false_number: 0,
  });
  const { decrementLife, user } = useAuthStore();

  const timerRef = useRef(null);
  const progressAnim = useSharedValue(0);
  const confettiRef = useRef(null);

  console.log(user);

  const startGame = async () => {
    decrementLife();
    setLoading(true);
    let newQuestions = [];

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
      case "plate20":
        newQuestions = quizService.generatePlateQuestions(20);
        break;
      case "country-capital":
        newQuestions = await quizService.generateCountryCapitalQuestions();
        break;
      case "country-continent":
        newQuestions = await quizService.generateCountryContinentQuestions();
        break;
      case "country-flag":
        newQuestions = await quizService.generateCountryFlagQuestions();
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
    setLoading(false);
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

    let isCorrect = false;
    let isSkipped = index === null;

    if (index === questions[currentQuestion]?.correctAnswer) {
      setScore((prev) => prev + 10);
      confettiRef.current?.play();
      isCorrect = true;
    }

    // Her cevap için question_number + doğru/yanlış
    setQuizData((prev) => ({
      ...prev,
      question_number: prev.question_number + 1,
      true_number: isSkipped
        ? prev.true_number
        : prev.true_number + (isCorrect ? 1 : 0),
      false_number: isSkipped
        ? prev.false_number
        : prev.false_number + (isCorrect ? 0 : 1),
    }));

    if (timerRef.current) clearInterval(timerRef.current);

    // Son soruya geldiysen quiz_number'ı 1 artır
    const isLastQuestion = currentQuestion + 1 === questions.length;

    setTimeout(() => {
      if (isLastQuestion) {
        setQuizData((prev) => ({
          ...prev,
          quiz_number: prev.quiz_number + 1,
        }));
      }

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
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Yükleniyor...</Text>
        </View>
      );
    }

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
        <Text style={styles.startTitle}>
          {type == "plate"
            ? "İller ve Plakaları\n"
            : type == "region"
              ? "Bölgeler ve İller\n"
              : type == "plate20"
                ? "İller ve Plakaları - 20\n"
                : type == "country-capital"
                  ? "Ülke - Başkent\n"
                  : type == "country-continent"
                    ? "Ülke - Kıta\n"
                    : type == "country-flag"
                      ? "Ülke - Bayrak\n"
                      : "İller ve İlçeleri\n"}{" "}
          Bilgi Yarışması
        </Text>
        <Text style={styles.startSubtitle}>
          {type === "country-capital"
            ? "Dünya ülkelerini ve başkentlerini ne kadar iyi biliyorsun?"
            : type === "country-continent"
              ? "Ülkeleri hangi kıtada yer aldıklarını ne kadar iyi biliyorsun?"
              : type === "country-flag"
                ? "Dünya bayraklarını ne kadar iyi tanıyorsun?"
                : "Türkiye'nin" +
                  " " +
                  (type == "plate"
                    ? "şehir plakalarını"
                    : type == "region"
                      ? "bölgelerini ve şehirlerini"
                      : "illerini ve ilçelerini") +
                  " " +
                  "ne kadar iyi biliyorsun?"}
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>BAŞLA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>GERİ</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.container}>
        <Text>Sorular yükleniyor veya alınamadı...</Text>
        <TouchableOpacity
          style={[styles.startButton, { marginTop: 20 }]}
          onPress={() => {
            // allow user to try again
            startGame();
          }}
        >
          <Text style={styles.startButtonText}>Yeniden Deneyin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentQuestion >= questions.length) {
    return (
      <ResultScreen
        score={score}
        startGame={startGame}
        confettiRef={confettiRef}
        quizData={quizData}
      />
    );
  }

  const alphabet = ["A", "B", "C", "D", "E"];

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.header}>
          <Animated.Text
            key={currentQuestion}
            entering={SlideInDown.duration(300)}
            exiting={FadeOut.duration(200)}
            style={styles.questionCounter}
          >
            {currentQuestion + 1}
            <Text>{" / " + questions.length}</Text>
          </Animated.Text>

          <Text style={styles.scoreText}>Puan: {score}</Text>

          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={styles.timerContainer}
          >
            <Text style={styles.timerText}>{timeLeft}</Text>
          </Animated.View>
        </View>

        <View style={styles.progressBarContainer}>
          <TimerBar duration={20000} resetTrigger={resetTimerKey} />
        </View>
      </View>

      <View>
        <Animated.View
          key={`question-${currentQuestion}`}
          entering={SlideInUp.duration(300)}
          exiting={FadeOutUp.duration(200)}
          style={styles.questionContainer}
        >
          {questions[currentQuestion]?.flagUrl && (
            <View style={styles.flagContainer}>
              <Image
                source={{ uri: questions[currentQuestion]?.flagUrl }}
                style={styles.flagImage}
              />
            </View>
          )}
          <Text style={styles.questionText}>
            <Text
              style={
                questions[currentQuestion]?.type === true
                  ? styles.positiveQuestion
                  : questions[currentQuestion]?.type === false
                    ? styles.negativeQuestion
                    : styles.questionText
              }
            >
              {questions[currentQuestion]?.question}
            </Text>
          </Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion]?.options.map((option, index) => {
            const isCorrect =
              index === questions[currentQuestion]?.correctAnswer;
            const isSelected = index === selectedAnswer;

            let bgColor = COLORS.cardBackground;
            if (isAnswered) {
              if (isCorrect) bgColor = "#4CAF50";
              else if (isSelected) bgColor = "#F44336";
            }

            return (
              <Animated.View
                key={`${questions[currentQuestion].id + index}`}
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
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
      <View style={styles.footer}></View>
    </View>
  );
}
