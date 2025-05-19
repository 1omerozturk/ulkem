import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { initDB, getUser } from "../model/db";
import { AuthState } from "../model/authModel";

// DB başlatma
initDB();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  register: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      // Kullanıcı var mı kontrolü
      const existingUser = await getUser(username);
      if (existingUser) {
        throw new Error("Bu kullanıcı adı zaten alınmış");
      }

      // Yeni kullanıcı ekleme
      const result = db.execSync(
        "INSERT INTO users (username, password) VALUES (?,?)",
        [username, password]
      );

      const newUser = {
        id: result.insertId,
        username,
        score: 0,
        lives: 3,
        last_life_update: new Date().toISOString(),
      };

      set({ user: newUser });
      await SecureStore.setItemAsync("user", JSON.stringify(newUser));
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = (await new Promise())<User>((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password],
            (_, { rows }) => {
              if (rows.length) {
                const user = rows.item(0);
                SecureStore.setItemAsync("user", JSON.stringify(user));
                resolve(user);
              } else {
                reject(new Error("Kullanıcı adı veya şifre hatalı"));
              }
            },
            (_, error) => reject(error)
          );
        });
      });
      set({ user });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    SecureStore.deleteItemAsync("user");
    set({ user: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const userJson = await SecureStore.getItemAsync("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        // Veritabanından güncel bilgileri kontrol et
        const dbUser = await getUser(user.username);
        set({ user: dbUser || null });
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
