export interface QuizData {
  quiz_number: number;
  question_number: number;
  true_number: number;
  false_number: number;
}

export interface User {
  id: number;
  username: string;
  profile: null | string;
  password: string;
  score: number;
  lives: number;
  last_life_update: string; // ISO formatta saklanacak
}

export interface AuthState {
  user: User | null;
  quizData: QuizData | null;
  isLoading: boolean;
  error: string | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  decrementLife: () => Promise<void>;
  refreshLivesIfNeeded: () => Promise<void>;
}
