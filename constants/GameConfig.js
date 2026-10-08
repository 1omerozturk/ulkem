const BRAND = Object.freeze({
  name: "YurtPusula",
  tagline: "Bilgiyle keşfet.",
  loadingMessage: "Yeni keşifler hazırlanıyor…",
  explorerTitle: "YurtPusula kaşifi",
  splashBackground: "#F1F6F3",
  assets: Object.freeze({
    logo: "./assets/brand/yurtpusula-mark.png",
    appIcon: "./assets/brand/yurtpusula-app-icon.png",
  }),
});

const GAME_RULES = Object.freeze({
  questionsPerQuiz: 10,
  questionTimeSeconds: 20,
  mapQuestionTimeSeconds: 25,
  answerRevealMilliseconds: 1400,
  pointsPerCorrectAnswer: 10,
  quickAnswerMaxBonus: 5,
  streakBonusPerCorrectAnswer: 2,
  maxStreakBonus: 10,
  maxLives: 10,
  lifeRechargeMinutes: 10,
  lifePurchaseCost: 500,
});

module.exports = { BRAND, GAME_RULES };
