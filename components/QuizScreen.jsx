import Lottie from "lottie-react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutUp,
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
import Loading from "./Loading";
import NoticeModal from "./NoticeModal";
import QuizMap from "./QuizMap";

const quizCopy = {
  plate: { title: "Plaka Avcısı", subtitle: "Kodundan şehri, şehrinden plakayı bul." },
  region: { title: "Bölge Bilgini Sına", subtitle: "Şehirleri doğru coğrafi bölgeye yerleştir." },
  district: { title: "İlçe Kaşifi", subtitle: "İlçelerin hangi şehre bağlı olduğunu keşfet." },
  metropolitan: { title: "Büyükşehir Bilgisi", subtitle: "Büyükşehir statüsündeki illeri tanı." },
  "map-province": { title: "Haritada İli Bul", subtitle: "Haritadaki vurguyu incele ve doğru ili seç." },
  "country-capital": { title: "Başkent Ustası", subtitle: "Ülkeleri başkentleriyle eşleştir." },
  "country-continent": { title: "Kıta Kaşifi", subtitle: "Ülkelerin hangi kıtada olduğunu bul." },
  "country-flag": { title: "Bayrak Dedektifi", subtitle: "Bayrağı gör, ülkeyi tahmin et." },
};

export default function QuizScreen({ type }) {
  const router = useRouter();
  const [resetTimerKey, setResetTimerKey] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [notice, setNotice] = useState(null);
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
  const decrementLife = useAuthStore((state) => state.decrementLife);

  const timerRef = useRef(null);
  const progressAnim = useSharedValue(0);
  const confettiRef = useRef(null);
  const closeNotice = () => setNotice(null);


  const startGame = async () => {
    setPhase("loading");
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(20);
    setQuizData({ quiz_number: 0, question_number: 0, true_number: 0, false_number: 0 });
    try {
      let newQuestions = [];
      switch (type) {
        case "district":
          newQuestions = await quizService.generateDistrictQuestions();
          break;
        case "region":
          newQuestions = await quizService.generateRegionQuestions();
          break;
        case "plate":
          newQuestions = await quizService.generatePlateQuestions();
          break;
        case "metropolitan":
          newQuestions = await quizService.generateMetropolitanQuestions();
          break;
        case "map-province":
          newQuestions = await quizService.generateMapProvinceQuestions();
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

      if (!newQuestions.length) {
        throw new Error("Quiz için soru oluşturulamadı. Lütfen tekrar deneyin.");
      }

      const lifeSpent = await decrementLife();
      if (!lifeSpent) {
        setPhase("intro");
        setNotice({
          title: "Biraz mola zamanı",
          message: "Canın kalmamış. Yeni canın 10 dakikada bir yenilenir.",
          icon: "heart-dislike",
          confirmLabel: "Canları gör",
          cancelLabel: "Daha sonra",
          onConfirm: () => { closeNotice(); router.push("/life"); },
        });
        return;
      }

      setQuestions(newQuestions);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(20);
      setResetTimerKey((prev) => prev + 1);
      setPhase("playing");
    } catch (error) {
      console.error("Quiz başlatılamadı:", error);
      setPhase("intro");
      setNotice({
        title: "Quiz açılamadı",
        message: error instanceof Error ? error.message : "Lütfen tekrar deneyin.",
        icon: "cloud-offline-outline",
        confirmLabel: "Anladım",
        onConfirm: closeNotice,
      });
    }
  };

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentQuestion((prev) => prev + 1);
    setTimeLeft(20);
    setResetTimerKey((prev) => prev + 1);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          nextQuestion();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
  }, [nextQuestion]);

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
    if (phase === "playing" && questions.length && currentQuestion < questions.length) {
      const frame = requestAnimationFrame(() => {
        resetTimer();
        progressAnim.value = withTiming(1, { duration: 20000 });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [currentQuestion, phase, progressAnim, questions.length, resetTimer]);

  useEffect(() => {
    const isPlaying =
      phase === "playing" && questions.length > 0 && currentQuestion < questions.length;
    if (!isPlaying) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setNotice({
          title: "Meydan okuma sürüyor",
          message: "Oyundan çıkmadan önce bu turu tamamla. Her soru seni hedefe yaklaştırıyor!",
          icon: "game-controller",
          confirmLabel: "Devam et",
          onConfirm: closeNotice,
        });
        return true;
      },
    );

    return () => subscription.remove();
  }, [currentQuestion, phase, questions.length]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  if (phase === "intro" || phase === "loading") {
    if (phase === "loading") {
      return <Loading message="Sorular hazırlanıyor…" />;
    }

    return (
      <>
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
        <Text style={styles.startTitle}>{quizCopy[type]?.title || "Bilgi Yarışması"}</Text>
        <Text style={styles.startSubtitle}>
          {quizCopy[type]?.subtitle || "Hazırsan başlayalım!"}
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>BAŞLA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>GERİ</Text>
        </TouchableOpacity>
      </Animated.View>
      <NoticeModal {...notice} visible={!!notice} onCancel={closeNotice} />
      </>
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

  if (phase === "playing" && currentQuestion >= questions.length) {
    return (
      <>
        <ResultScreen
          score={score}
          startGame={startGame}
          confettiRef={confettiRef}
          quizData={quizData}
        />
        <NoticeModal {...notice} visible={!!notice} onCancel={closeNotice} />
      </>
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
          {questions[currentQuestion]?.map && (
            <QuizMap {...questions[currentQuestion].map} />
          )}
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
                          ? COLORS.authSuccess
                          : isSelected
                            ? COLORS.authError
                            : COLORS.authSurface
                        : COLORS.authSurface,
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
      <NoticeModal {...notice} visible={!!notice} onCancel={closeNotice} />
    </View>
  );
}
