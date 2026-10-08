import Lottie from "lottie-react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
import { useGameAudio } from "./GameAudioProvider";

const quizCopy = {
  plate: { title: "Plaka Avcısı", subtitle: "Kodundan şehri, şehrinden plakayı bul." },
  region: { title: "Bölge Bilgini Sına", subtitle: "Şehirleri doğru coğrafi bölgeye yerleştir." },
  district: { title: "İlçe Kaşifi", subtitle: "İlçelerin hangi şehre bağlı olduğunu keşfet." },
  metropolitan: { title: "Büyükşehir Bilgisi", subtitle: "Büyükşehir statüsündeki illeri tanı." },
  "map-province": { title: "Haritada İli Bul", subtitle: "Haritadaki vurguyu incele ve doğru ili seç." },
  "country-capital": { title: "Başkent Ustası", subtitle: "Ülkeleri başkentleriyle eşleştir." },
  "country-city": { title: "Şehirden Ülkeye", subtitle: "Şehrin hangi ülkeye ait olduğunu bul." },
  "country-continent": { title: "Kıta Kaşifi", subtitle: "Ülkelerin hangi kıtada olduğunu bul." },
  "country-flag": { title: "Bayrak Dedektifi", subtitle: "Bayrağı gör, ülkeyi tahmin et." },
  "map-country": { title: "Haritada Ülkeyi Bul", subtitle: "Haritadaki işareti incele ve ülkeyi keşfet." },
};

const quizIcons = {
  plate: "keypad",
  region: "earth",
  district: "business",
  metropolitan: "business",
  "map-province": "map",
  "country-capital": "compass",
  "country-city": "navigate-circle",
  "country-continent": "globe",
  "country-flag": "flag",
  "map-country": "map",
};

export default function QuizScreen({ type, continent = "all", returnTo }) {
  const router = useRouter();
  const categoryRoute =
    returnTo || (type?.startsWith("country-") || type === "map-country" ? "/quiz/world" : "/quiz/turkey");
  const goToCategory = useCallback(() => router.replace(categoryRoute), [categoryRoute, router]);
  const continentCode = Array.isArray(continent) ? continent[0] || "all" : continent || "all";
  const continentName = continentCode === "all" ? null : getContinentName(continentCode);
  const activeQuizCopy = quizCopy[type] || { title: "Bilgi Yarışması", subtitle: "Hazırsan başlayalım!" };
  const introTitle = continentName ? `${continentName} · ${activeQuizCopy.title}` : activeQuizCopy.title;
  const introSubtitle = continentName
    ? type === "country-continent"
      ? `${continentName} kıtasına ait ülkeleri seçeneklerden bul.`
      : `${continentName} ülkelerini keşfetmeye hazır mısın?`
    : activeQuizCopy.subtitle;
  const questionDurationSeconds = type === "map-province" || type === "map-country"
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
  const [comboBonusTotal, setComboBonusTotal] = useState(0);
  const [speedBonusTotal, setSpeedBonusTotal] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [quizData, setQuizData] = useState({
    quiz_number: 0,
    question_number: 0,
    true_number: 0,
    false_number: 0,
  });
  const decrementLife = useAuthStore((state) => state.decrementLife);
  const { playSound } = useGameAudio();

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
    setComboBonusTotal(0);
    setSpeedBonusTotal(0);
    setBestCombo(0);
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
        case "country-city":
          newQuestions = await quizService.generateCountryCityQuestions(
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
        case "map-country":
          newQuestions = await quizService.generateMapCountryQuestions(
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
    if (index !== null) playSound("answerSelect");

    let isCorrect = false;
    if (index === questions[currentQuestion]?.correctAnswer) {
      const nextCombo = streak + 1;
      const comboBonus =
        Math.min(streak, GAME_RULES.maxStreakBonus) *
        GAME_RULES.streakBonusPerCorrectAnswer;
      const speedBonus = Math.ceil(
        (Math.max(0, timeLeft) / questionDurationSeconds) *
          GAME_RULES.quickAnswerMaxBonus,
      );
      setScore(
        (prev) =>
          prev +
          GAME_RULES.pointsPerCorrectAnswer +
          comboBonus +
          speedBonus,
      );
      setComboBonusTotal((prev) => prev + comboBonus);
      setSpeedBonusTotal((prev) => prev + speedBonus);
      setBestCombo((prev) => Math.max(prev, nextCombo));
      setStreak(nextCombo);
      confettiRef.current?.play();
      isCorrect = true;
    } else {
      setStreak(0);
    }

    setTimeout(() => playSound(isCorrect ? "correct" : "incorrect"), 140);

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
  }, [currentQuestion, isAnswered, nextQuestion, playSound, questionDurationSeconds, questions, streak, timeLeft]);

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
    const isResult =
      phase === "playing" && questions.length > 0 && currentQuestion >= questions.length;
    if (phase !== "intro" && phase !== "loading" && !isResult && phase !== "playing") return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (phase === "intro" || phase === "loading" || isResult) {
          goToCategory();
          return true;
        }
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
  }, [currentQuestion, goToCategory, phase, questions.length]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  if (phase === "intro" || phase === "loading") {
    if (phase === "loading") {
      return <Loading message="Sorular hazırlanıyor…" />;
    }

    return (
      <>
      <Animated.View style={styles.startContainer} entering={FadeIn.duration(450)}>
        <ScrollView
          contentContainerStyle={styles.startContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introTopBar}>
            <TouchableOpacity
              style={styles.introBackButton}
              onPress={goToCategory}
              accessibilityRole="button"
              accessibilityLabel="Quiz kategorilerine dön"
            >
              <Ionicons name="arrow-back" size={21} color={COLORS.authText} />
            </TouchableOpacity>
            <View style={styles.introBrandPill}>
              <Ionicons name="compass" size={15} color={COLORS.authPrimary} />
              <Text style={styles.introBrandText}>YURTPUSULA</Text>
            </View>
          </View>

          <LinearGradient
            colors={[COLORS.authPrimary, COLORS.menuTurkeyAccent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.introHero}
          >
            <View style={styles.introHeroGlow} />
            <View style={styles.introHeroIcon}>
              <Ionicons name={quizIcons[type] || "game-controller"} size={24} color={COLORS.authPrimary} />
            </View>
            <Lottie
              source={require("../assets/lottie/quiz.json")}
              autoPlay
              loop
              style={styles.lottieStart}
            />
            <Text style={styles.introEyebrow}>YENİ BİR KEŞİF BAŞLIYOR</Text>
          </LinearGradient>

          <View style={styles.introCopy}>
            <Text style={styles.startTitle}>{introTitle}</Text>
            <Text style={styles.startSubtitle}>{introSubtitle}</Text>
          </View>

          <View style={styles.introDetailsCard}>
            <View style={styles.introDetailItem}>
              <View style={styles.introDetailIcon}>
                <Ionicons name="help-circle" size={19} color={COLORS.authPrimary} />
              </View>
              <Text style={styles.introDetailValue}>{GAME_RULES.questionsPerQuiz}</Text>
              <Text style={styles.introDetailLabel}>SORU</Text>
            </View>
            <View style={styles.introDetailDivider} />
            <View style={styles.introDetailItem}>
              <View style={styles.introDetailIcon}>
                <Ionicons name="time" size={19} color={COLORS.menuTurkeyAccent} />
              </View>
              <Text style={styles.introDetailValue}>{questionDurationSeconds} sn</Text>
              <Text style={styles.introDetailLabel}>HER SORU</Text>
            </View>
            <View style={styles.introDetailDivider} />
            <View style={styles.introDetailItem}>
              <View style={styles.introDetailIcon}>
                <Ionicons name="flash" size={19} color={COLORS.authAccent} />
              </View>
              <Text style={styles.introDetailValue}>+{GAME_RULES.pointsPerCorrectAnswer}</Text>
              <Text style={styles.introDetailLabel}>DOĞRU CEVAP</Text>
            </View>
          </View>

          <View style={styles.introActions}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={startGame}
              activeOpacity={0.86}
              accessibilityRole="button"
            >
              <Text style={styles.startButtonText}>MEYDAN OKUMAYA BAŞLA</Text>
              <Ionicons name="arrow-forward-circle" size={23} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.introHint}>Hazır olduğunda pusulanı takip et</Text>
          </View>
        </ScrollView>
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
          quizTitle={introTitle}
          totalQuestions={questions.length}
          comboBonusTotal={comboBonusTotal}
          speedBonusTotal={speedBonusTotal}
          bestCombo={bestCombo}
          onChooseCategory={goToCategory}
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
            <Text style={styles.streakLabel}>COMBO</Text>
            <Text style={styles.streakText}>x{streak}</Text>
          </View>
        </View>

        <TimerBar
          duration={questionDurationMs}
          remainingSeconds={timeLeft}
          paused={isAnswered || Boolean(notice)}
          resetTrigger={resetTimerKey}
        />
      </View>

      <View>
        <Animated.View
          key={`question-${currentQuestion}`}
          entering={SlideInUp.duration(300)}
          exiting={FadeOutUp.duration(200)}
          style={[
            styles.questionContainer,
            type === "map-country" && styles.mapQuestionContainer,
          ]}
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
