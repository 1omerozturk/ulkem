export const BRAND: Readonly<{
  name: string;
  tagline: string;
  loadingMessage: string;
  explorerTitle: string;
  splashBackground: string;
  assets: Readonly<{ logo: string; appIcon: string }>;
}>;

export const GAME_RULES: Readonly<{
  questionsPerQuiz: number;
  questionTimeSeconds: number;
  mapQuestionTimeSeconds: number;
  answerRevealMilliseconds: number;
  pointsPerCorrectAnswer: number;
  quickAnswerMaxBonus: number;
  streakBonusPerCorrectAnswer: number;
  maxStreakBonus: number;
  maxLives: number;
  lifeRechargeMinutes: number;
  lifePurchaseCost: number;
}>;
