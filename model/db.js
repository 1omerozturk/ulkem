import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('ulkemdb')

export const initDB = async () => {
  try {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          profile TEXT,
          score INTEGER DEFAULT 0,
          lifetime_score INTEGER NOT NULL DEFAULT 0,
          owned_avatars TEXT NOT NULL DEFAULT '["compass"]',
          lives INTEGER DEFAULT 10,
          last_life_update TEXT DEFAULT (datetime('now'))
          )
          `)

    const userColumns = await db.getAllAsync('PRAGMA table_info(users)')
    if (!userColumns.some((column) => column.name === 'lifetime_score')) {
      await db.execAsync('ALTER TABLE users ADD COLUMN lifetime_score INTEGER NOT NULL DEFAULT 0')
    }
    if (!userColumns.some((column) => column.name === 'owned_avatars')) {
      await db.execAsync(`ALTER TABLE users ADD COLUMN owned_avatars TEXT NOT NULL DEFAULT '["compass"]'`)
    }
    // Bring older accounts forward without counting points that were already spent.
    await db.runAsync(
      'UPDATE users SET lifetime_score = COALESCE(score, 0) WHERE lifetime_score < COALESCE(score, 0)',
    )

    await db.execAsync(`
  CREATE TABLE IF NOT EXISTS quiz_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    quiz_number INTEGER DEFAULT 0,
    question_number INTEGER DEFAULT 0,
    true_number INTEGER DEFAULT 0,
    false_number INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`)
  } catch (err) {
    console.error('DB Init Error:', err)
  }
}

export const insertUser = async (username, password, profile) => {
  try {
    const result = await db.runAsync(
      `
      INSERT INTO users (username, password, profile) VALUES (?, ?, ?);
    `,
      [username, password, profile],
    )
    const userId = result.lastInsertRowId
    await insertUserQuizData(userId)
    return userId
    // Kullanıcının ID'sini döndür
  } catch (error) {
    console.error('Insert User Error:', error)
    throw error
  }
}

export const deleteDb = async () => {
  await db.execAsync('DROP DATABASE quizApp')
}

export const getUser = async (id) => {
  const user = await db.getFirstAsync(
    'SELECT id, username, score, lifetime_score, owned_avatars, profile, lives, last_life_update FROM users WHERE id = ? ',
    [id],
  )

  if (!user) return null // Kullanıcı bulunmazsa null döndür

  // Kullanıcının quiz verilerini çekiyoruz
  const quizData = await db.getFirstAsync(
    'SELECT quiz_number, question_number, true_number, false_number FROM quiz_data WHERE user_id = ?',
    [user.id],
  )

  return {
    ...user,
    quizData: (quizData ??= {
      quiz_number: 0,
      question_number: 0,
      true_number: 0,
      false_number: 0,
    }),
    // Eğer veri yoksa default değer ekle
  }
}

export const getUserWithUserName = async (username) => {
  const result = await db.getFirstAsync(
    'SELECT * FROM users WHERE username = ?',
    [username],
  )
    return result ?? null
}

export const getUsers = async () => {
  const result = await db.getAllAsync('SELECT * FROM users')
  return result ?? null
}

export const deleteUsers = async () => {
  const result = await db.runAsync('DELETE FROM users')
  return result ?? null
}

export const getUserWithPassword = async (username, password) => {
  const result = await db.getFirstAsync(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
  )
  return result ?? null
}
export const getUserWithQuizData = async (username, password) => {
  // Kullanıcı bilgilerini şifre hariç alıyoruz
  const user = await db.getFirstAsync(
    'SELECT id, username, profile, score, lifetime_score, owned_avatars, lives, last_life_update FROM users WHERE username = ? AND password = ?',
    [username, password],
  )

  if (!user) return null // Kullanıcı bulunmazsa null döndür

  // Kullanıcının quiz verilerini çekiyoruz
  const quizData = await db.getFirstAsync(
    'SELECT quiz_number, question_number, true_number, false_number FROM quiz_data WHERE user_id = ?',
    [user.id],
  )

  return {
    ...user,
    quizData: (quizData ??= {
      quiz_number: 0,
      question_number: 0,
      true_number: 0,
      false_number: 0,
    }), // Eğer veri yoksa default değer ekle
  }
}

export const updateUserLives = async (username, lives, last_life_update) => {
  await db.runAsync(
    'UPDATE users SET lives = ?, last_life_update = ? WHERE username = ?',
    [lives, last_life_update, username],
  )
}

export const purchaseUserLife = async (username, cost, maxLives) => {
  const result = await db.runAsync(
    'UPDATE users SET lives = lives + 1, score = score - ? WHERE username = ? AND lives < ? AND score >= ?',
    [cost, username, maxLives, cost],
  )
  return result.changes > 0
}

export const grantUserLife = async (username, maxLives, timestamp) => {
  const result = await db.runAsync(
    'UPDATE users SET lives = lives + 1, last_life_update = COALESCE(last_life_update, ?) WHERE username = ? AND lives < ?',
    [timestamp, username, maxLives],
  )
  return result.changes > 0
}

export const updateUserProfile = async (userId, profile) => {
  await db.runAsync('UPDATE users SET profile = ? WHERE id = ?', [profile, userId])
}

export const updateUserAvatarData = async (userId, profile, ownedAvatars) => {
  await db.runAsync(
    'UPDATE users SET profile = ?, owned_avatars = ? WHERE id = ?',
    [profile, JSON.stringify(ownedAvatars), userId],
  )
}

export const purchaseUserAvatar = async (userId, profile, cost, ownedAvatars) => {
  const result = await db.runAsync(
    'UPDATE users SET profile = ?, score = score - ?, owned_avatars = ? WHERE id = ? AND score >= ?',
    [profile, cost, JSON.stringify(ownedAvatars), userId, cost],
  )
  return result.changes > 0
}

export const updateUserScore = async (userId, score) => {
  await db.runAsync('UPDATE users SET score = ? WHERE id = ?', [score, userId])
}

export const addUserBonusScore = async (userId, points) => {
  const result = await db.runAsync(
    'UPDATE users SET score = score + ?, lifetime_score = COALESCE(lifetime_score, 0) + ? WHERE id = ?',
    [points, points, userId],
  )
  return result.changes > 0
}

export const updateUserQuizAndScore = async (
  userId,
  score,
  quizNumber,
  questionNumber,
  trueNumber,
  falseNumber,
  earnedScore,
) => {
  await db.runAsync(
    'UPDATE users SET score = ?, lifetime_score = COALESCE(lifetime_score, 0) + ? WHERE id = ?',
    [score, earnedScore, userId],
  )

  await updateUserQuizData(
    userId,
    quizNumber,
    questionNumber,
    trueNumber,
    falseNumber,
  )
}

// Quiz Data CRUD with userID

export const getUserQuizData = async (userId) => {
  const result = await db.getFirstAsync(
    'SELECT quiz_number,question_number, true_number, false_number FROM quiz_data WHERE user_id = ?',
    [userId],
  )
  return result ?? { quiz_number: 0, true_number: 0, false_number: 0 } // Eğer veri yoksa default değer döndür
}

export const updateUserQuizData = async (
  userId,
  quizNumber,
  questionNumber,
  trueNumber,
  falseNumber,
) => {
  await db.runAsync(
    'UPDATE quiz_data SET quiz_number = ?, question_number = ?, true_number = ?, false_number = ? WHERE user_id = ?',
    [quizNumber, questionNumber, trueNumber, falseNumber, userId],
  )
}

export const insertUserQuizData = async (userId) => {
  await db.runAsync(
    'INSERT INTO quiz_data (user_id, quiz_number, question_number, true_number, false_number) VALUES (?, 0, 0, 0, 0)',
    [userId],
  )
}
