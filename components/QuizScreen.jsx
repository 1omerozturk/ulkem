import Lottie from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutUp,
  runOnJS,
  SlideInDown,
  SlideInUp,
  useSharedValue,
  withTiming,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { styles } from "../assets/styles/quiz.styles";
import { COLORS } from "../constants/Colors";
import { quizService } from "../service/quizService";
import ResultScreen from "./ResultScreen";
import TimerBar from "./TimerBar";
import { goBack } from "expo-router/build/global-state/routing";
import { useAuthStore } from "../store/authStore";

export default function QuizScreen({ type }) {
  const [resetTimerKey, setResetTimerKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
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

  const startGame = () => {
    decrementLife();
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

      case "plate20":
        newQuestions = quizService.generatePlateQuestions(3);
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
            ? "İller ve Plakaları"
            : type == "region"
            ? "Bölgeler ve İller"
            : type == "plate20"
            ? "İller ve Plakaları - 20"
            : "İller ve İlçeleri"}{" "}
          Bilgi Yarışması
        </Text>
        <Text style={styles.startSubtitle}>
          Türkiye'nin{" "}
          {type == "plate"
            ? "şehir plakalarını"
            : type == "region"
            ? "bölgelerini ve şehirlerini"
            : "illerini ve ilçelerini"}{" "}
          ne kadar iyi biliyorsun?
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
        <Text>Yükleniyor...</Text>
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
      </View>

      <View>
        <Animated.View
          key={`question-${currentQuestion}`}
          entering={SlideInUp.delay(200).springify().damping(20).stiffness(150)}
          exiting={FadeOutUp.duration(400).easing(Easing.inOut(Easing.linear))}
          style={styles.questionContainer}
        >
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
            const delay = 300;
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
                entering={
                  index % 2 === 0
                    ? FadeInLeft.delay(delay * (index + 1))
                        .springify()
                        .damping(100)
                        .stiffness(150)
                    : FadeInRight.delay(delay * (index + 1))
                        .springify()
                        .damping(100)
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
      <View style={styles.footer}></View>
    </View>
  );
}
