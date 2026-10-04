import * as SecureStore from 'expo-secure-store'
import { create } from 'zustand'
import {
  getUser,
  getUserWithQuizData,
  getUserWithUserName,
  insertUser,
  updateUserLives,
  updateUserLivesToBuy,
  updateUserQuizAndScore,
  updateUserScore,
} from '../model/db'

// await db.execAsync(`DROP TABLE IF EXISTS users;`)
// initDB()

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  register: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const existingUser = await getUserWithUserName(username)
      if (existingUser) throw new Error('Kullanıcı adı zaten alınmış')
      const profileImage = `https://api.dicebear.com/7.x/avataaars/png?seed=${username}`
      const insertId = await insertUser(username, password, profileImage)
      const newUser = {
        id: insertId,
        profile: profileImage,
        score: 0,
        lives: 10,
        last_life_update: new Date().toISOString(),
      }

      await SecureStore.setItemAsync('user', JSON.stringify(newUser))
      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const user = await getUserWithQuizData(username, password)
      if (!user) throw new Error('Kullanıcı adı veya şifre hatalı')
      console.log(user)
      set({ user })
      await SecureStore.setItemAsync('user', JSON.stringify(user))
      return { success: true, user: user }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('user')
    set({ user: null })
    return { success: true }
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const userJson = await SecureStore.getItemAsync('user')
      if (userJson) {
        const user = JSON.parse(userJson)
        const dbUser = await getUser(user.id)
        if (dbUser) {
          set({ user: dbUser })
        } else {
          set({ user: null })
        }
      } else {
        set({ user: null })
      }
    } catch (error) {
      console.error('Auth kontrolü hatası:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  decrementLife: async () => {
    try {
      await get().refreshLivesIfNeeded()
      const user = get().user
      if (!user || user.lives <= 0) return false

      const updatedLives = user.lives - 1
      const now = new Date().toISOString()
      const savedLifeDate = Date.parse(user.last_life_update)
      const lifeTimerStart =
        user.lives >= 10 || !Number.isFinite(savedLifeDate)
          ? now
          : user.last_life_update
      await updateUserLives(user.username, updatedLives, lifeTimerStart)
      const updatedUser = {
        ...user,
        lives: updatedLives,
        last_life_update: lifeTimerStart,
      }
      set({ user: updatedUser })
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },

  updateUserScore: async (score, quizData) => {
    try {
      const user = get().user
      if (!user) return

      const newTotalScore = user.score + score
      const newTotalQuizNumber =
        user.quizData.quiz_number + quizData.quiz_number
      const newTotalQuestionNumber =
        user.quizData.question_number + quizData.question_number
      const newTotalFalseNumber =
        user.quizData.false_number + quizData.false_number
      const newTotalTrueNumber =
        user.quizData.true_number + quizData.true_number

      await updateUserQuizAndScore(
        user.id,
        newTotalScore,
        newTotalQuizNumber,
        newTotalQuestionNumber, // Yeni alan burada devreye giriyor!
        newTotalTrueNumber,
        newTotalFalseNumber,
      )

      const updatedUser = {
        ...user,
        score: newTotalScore,
        quizData: {
          quiz_number: newTotalQuizNumber,
          question_number: newTotalQuestionNumber,
          true_number: newTotalTrueNumber,
          false_number: newTotalFalseNumber,
        },
      }

      set({ user: updatedUser })
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Puan güncelleme hatası:', error)
    }
  },

  refreshLivesIfNeeded: async () => {
    try {
      const user = get().user
      if (!user) return

      const now = new Date()
      const savedLifeDate = Date.parse(user.last_life_update)
      if (!Number.isFinite(savedLifeDate)) {
        const timestamp = now.toISOString()
        await updateUserLives(user.username, user.lives, timestamp)
        const updatedUser = { ...user, last_life_update: timestamp }
        set({ user: updatedUser })
        await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
        return
      }
      const lastUpdate = new Date(savedLifeDate)
      const minutesPassed = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)

      if (user.lives < 10 && minutesPassed >= 10) {
        const canEklenecek = Math.floor(minutesPassed / 10)
        const yeniCan = Math.min(user.lives + canEklenecek, 10)
        const yeniTarih = new Date(
          lastUpdate.getTime() + canEklenecek * 10 * 60 * 1000,
        )
        await updateUserLives(user.username, yeniCan, yeniTarih.toISOString())

        const updatedUser = {
          ...user,
          lives: yeniCan,
          last_life_update: yeniTarih.toISOString(),
        }
        set({ user: updatedUser })
        await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error(error)
    }
  },

  getRemainingTimeForNextLife: () => {
    const user = get().user
    if (!user) return '00:00'

    const now = new Date()
    const lastUpdateTimestamp = Date.parse(user.last_life_update)

    // Kullanıcı max cana ulaştıysa süre göstermeye gerek yok
    if (user.lives >= 10) return '00:00'

    const timeUntilNextLife = 10 * 60 * 1000 // 10 dakika sonra yeni can eklenecek
    if (!Number.isFinite(lastUpdateTimestamp)) return '10:00'

    const elapsedTime = Math.max(0, now.getTime() - lastUpdateTimestamp)
    const remainingTime = Math.max(timeUntilNextLife - elapsedTime, 0)

    const minutes = Math.floor(remainingTime / (1000 * 60))
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000)

    // Tek haneli sayıları başına 0 ekleyerek formatlıyoruz (09:03 gibi görünmesi için)
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
  },

  buyLife: async () => {
    try {
      const user = get().user
      if (!user || user.lives >= 10 || user.score < 500) return false

      const updatedLives = user.lives + 1
      const updatedScore = user.score - 500

      await updateUserLivesToBuy(user.username, updatedLives)
      await updateUserScore(user.id, updatedScore)

      const updatedUser = {
        ...user,
        lives: updatedLives,
        score: updatedScore,
        last_life_update: user.last_life_update || new Date().toISOString(),
      }
      set({ user: updatedUser })
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error('Buy Life Error:', error)
      return false
    }
  },
}))
