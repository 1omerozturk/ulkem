import * as SQLite from 'expo-sqlite';
import { User } from './authModel';

// Yeni versiyonda openDatabaseSync kullanılıyor
export const db = SQLite.openDatabaseSync('quizApp.db');

// Tablo oluşturma fonksiyonu
export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      score INTEGER DEFAULT 0,
      lives INTEGER DEFAULT 3,
      last_life_update DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Kullanıcı sorgulama (Promise tabanlı)
export const getUser = (username: string): Promise<User | null> => {
  return new Promise((resolve) => {
    const result = db.execSync(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    resolve(result?.length ? result[0] : null);
  });
};