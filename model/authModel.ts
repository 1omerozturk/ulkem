export interface User {
  id: number;
  username: string;
  score: number;
  lives: number;
  last_life_update: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}