import Lottie from "lottie-react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
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
} from "react-native-reanimated";
import { styles } from "../assets/styles/quiz.styles";
import { COLORS } from "../constants/Colors";
import { GAME_RULES } from "../constants/GameConfig";
import { Ionicons } from "@expo/vector-icons";
import { quizService } from "../service/quizService";
import { getContinentName } from "../model/world/continents";
import { useAuthStore } from "../store/authStore";
import ResultScreen from "./ResultScreen";
import TimerBar from "./TimerBar";
import Loading from "./Loading";
import NoticeModal from "./NoticeModal";
import QuizMap from "./QuizMap";
import QuizVisual from "./QuizVisual";

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

export default function QuizScreen({ type, continent = "all" }) {
  const router = useRouter();
  const continentCode = Array.isArray(continent) ? continent[0] || "all" : continent || "all";
  const continentName = continentCode === "all" ? null : getContinentName(continentCode);
  const activeQuizCopy = quizCopy[type] || { title: "Bilgi Yarışması", subtitle: "Hazırsan başlayalım!" };
  const introTitle = continentName ? `${continentName} · ${activeQuizCopy.title}` : activeQuizCopy.title;
  const introSubtitle = continentName
    ? type === "country-continent"
      ? `${continentName} kıtasına ait ülkeleri seçeneklerden bul.`
      : `${continentName} ülkelerini keşfetmeye hazır mısın?`
    : activeQuizCopy.subtitle;
  const questionDurationSeconds = type === "map-province"
    ? GAME_RULES.mapQuestionTimeSeconds
    : GAME_RULES.questionTimeSeconds;
  const questionDurationMs = questionDurationSeconds * 1000;
  const [resetTimerKey, setResetTimerKey] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [notice, setNotice] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(questionDurationSeconds);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizData, setQuizData] = useState({
    quiz_number: 0,
    question_number: 0,
    true_number: 0,
    false_number: 0,
  });
  const decrementLife = useAuthStore((state) => state.decrementLife);

  const timerRef = useRef(null);
  const confettiRef = useRef(null);
  const closeNotice = () => setNotice(null);


  const startGame = async () => {
    setPhase("loading");
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(questionDurationSeconds);
    setStreak(0);
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
          newQuestions = await quizService.generateCountryCapitalQuestions(
            GAME_RULES.questionsPerQuiz,
            continentCode,
          );
          break;
        case "country-continent":
          newQuestions = await quizService.generateCountryContinentQuestions(
            GAME_RULES.questionsPerQuiz,
            continentCode,
          );
          break;
        case "country-flag":
          newQuestions = await quizService.generateCountryFlagQuestions(
            GAME_RULES.questionsPerQuiz,
            continentCode,
          );
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
          message: `Canın kalmamış. Yeni canın ${GAME_RULES.lifeRechargeMinutes} dakikada bir yenilenir.`,
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
      setTimeLeft(questionDurationSeconds);
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
    setTimeLeft(questionDurationSeconds);
    setResetTimerKey((prev) => prev + 1);
  }, [questionDurationSeconds]);

  const handleAnswer = useCallback((index) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    let isCorrect = false;
    if (index === questions[currentQuestion]?.correctAnswer) {
      const bonus = Math.min(streak, GAME_RULES.maxStreakBonus);
      setScore((prev) => prev + GAME_RULES.pointsPerCorrectAnswer + bonus * GAME_RULES.streakBonusPerCorrectAnswer);
      setStreak((prev) => prev + 1);
      confettiRef.current?.play();
      isCorrect = true;
    } else {
      setStreak(0);
    }

    // Her cevap için question_number + doğru/yanlış
    setQuizData((prev) => ({
      ...prev,
      question_number: prev.question_number + 1,
      true_number: prev.true_number + (isCorrect ? 1 : 0),
      false_number: prev.false_number + (isCorrect ? 0 : 1),
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
    }, GAME_RULES.answerRevealMilliseconds);
  }, [currentQuestion, isAnswered, nextQuestion, questions, streak]);

  useEffect(() => {
    const isPlaying = phase === "playing" && questions.length > 0 && currentQuestion < questions.length;
    if (!isPlaying || isAnswered || notice) return;
    timerRef.current = setInterval(() => setTimeLeft((remaining) => Math.max(remaining - 1, 0)), 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQuestion, isAnswered, notice, phase, questions.length]);

  useEffect(() => {
    if (phase === "playing" && !isAnswered && !notice && timeLeft === 0) handleAnswer(null);
  }, [handleAnswer, isAnswered, notice, phase, timeLeft]);

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
        <Text style={styles.startTitle}>{introTitle}</Text>
        <Text style={styles.startSubtitle}>
          {introSubtitle}
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

          <View style={styles.scorePill}>
            <Ionicons name="trophy" size={14} color={COLORS.authAccent} />
            <Text style={styles.scoreText}>{score}</Text>
          </View>

          <View style={styles.streakPill}>
            <Ionicons name="flame" size={14} color={COLORS.menuTurkeyAccent} />
            <Text style={styles.streakText}>{streak}</Text>
          </View>

          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={[styles.timerContainer, timeLeft <= 5 && styles.timerUrgent]}
          >
            <Ionicons name="time-outline" size={15} color={COLORS.white} />
            <Text style={styles.timerText}>{timeLeft > 0 ? timeLeft : "BİTTİ"}</Text>
          </Animated.View>
        </View>

        <View style={styles.progressBarContainer}>
          <TimerBar duration={questionDurationMs} paused={isAnswered || Boolean(notice)} resetTrigger={resetTimerKey} />
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
          <QuizVisual visual={questions[currentQuestion]?.visual} />
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
          {isAnswered && selectedAnswer === null ? (
            <Text style={styles.timeoutMessage}>Süre doldu · doğru cevabı incele</Text>
          ) : null}
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
