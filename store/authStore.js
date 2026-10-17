import * as SecureStore from 'expo-secure-store'
import { create } from 'zustand'
import { GAME_RULES } from '../constants/GameConfig'
import {
  AVATARS,
  DEFAULT_AVATAR_ID,
  getAvatarProfile,
  getAvatarPurchaseCost,
  getAvatarUnlockPoints,
  getOwnedAvatarIds,
  getUnlockedAvatarCount,
  isLocalAvatarProfile,
} from '../constants/Avatars'
import {
  getUser,
  getUserWithQuizData,
  getUserWithUserName,
  insertUser,
  updateUserLives,
  purchaseUserLife,
  grantUserLife,
  updateUserAvatarData,
  purchaseUserAvatar,
  updateUserQuizAndScore,
  addUserBonusScore,
} from '../model/db'

const getFirstRunKey = (userId) => `yurtpusula_first_run_complete_${userId}`

const normalizeUserAvatarData = async (user) => {
  const profile = isLocalAvatarProfile(user.profile)
    ? user.profile
    : getAvatarProfile(DEFAULT_AVATAR_ID)
  const ownedAvatars = getOwnedAvatarIds(user.owned_avatars, profile)
  const ownedAvatarValue = JSON.stringify(ownedAvatars)

  if (profile !== user.profile || ownedAvatarValue !== user.owned_avatars) {
    await updateUserAvatarData(user.id, profile, ownedAvatars)
  }

  return { ...user, profile, owned_avatars: ownedAvatarValue }
}

// await db.execAsync(`DROP TABLE IF EXISTS users;`)
// initDB()

export const useAuthStore = create((set, get) => ({
  user: null,
  hasCompletedFirstRun: true,
  isLoading: false,
  error: null,

  register: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const existingUser = await getUserWithUserName(username)
      if (existingUser) throw new Error('Kullanıcı adı zaten alınmış')
      const profile = getAvatarProfile(DEFAULT_AVATAR_ID)
      const insertId = await insertUser(username, password, profile)
      const newUser = await getUser(insertId) || {
        id: insertId,
        username,
        profile,
        score: 0,
        lifetime_score: 0,
        owned_avatars: JSON.stringify([DEFAULT_AVATAR_ID]),
        lives: GAME_RULES.maxLives,
        last_life_update: new Date().toISOString(),
      }

      await SecureStore.setItemAsync(getFirstRunKey(newUser.id), 'false')
      await SecureStore.setItemAsync('user', JSON.stringify(newUser))
      set({ user: newUser, hasCompletedFirstRun: false })
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
      let user = await getUserWithQuizData(username, password)
      if (!user) throw new Error('Kullanıcı adı veya şifre hatalı')
      user = await normalizeUserAvatarData(user)
      const firstRunComplete = await SecureStore.getItemAsync(getFirstRunKey(user.id))
      set({ user, hasCompletedFirstRun: firstRunComplete !== 'false' })
      await SecureStore.setItemAsync('user', JSON.stringify(user))
      return { success: true, user }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('user')
    set({ user: null, hasCompletedFirstRun: true })
    return { success: true }
  },

  completeFirstRun: async () => {
    const user = get().user
    if (!user) return false
    try {
      await SecureStore.setItemAsync(getFirstRunKey(user.id), 'true')
      set({ hasCompletedFirstRun: true })
      return true
    } catch (error) {
      console.error('İlk kurulum tercihi kaydedilemedi:', error)
      return false
    }
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const userJson = await SecureStore.getItemAsync('user')
      if (userJson) {
        const user = JSON.parse(userJson)
        let dbUser = await getUser(user.id)
        if (dbUser) {
          dbUser = await normalizeUserAvatarData(dbUser)
          await SecureStore.setItemAsync('user', JSON.stringify(dbUser))
          const firstRunComplete = await SecureStore.getItemAsync(getFirstRunKey(dbUser.id))
          set({ user: dbUser, hasCompletedFirstRun: firstRunComplete !== 'false' })
        } else {
          set({ user: null, hasCompletedFirstRun: true })
        }
      } else {
        set({ user: null, hasCompletedFirstRun: true })
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
        user.lives >= GAME_RULES.maxLives || !Number.isFinite(savedLifeDate)
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
        score,
      )

      const updatedUser = {
        ...user,
        score: newTotalScore,
        lifetime_score: (user.lifetime_score ?? user.score ?? 0) + score,
        quizData: {
          quiz_number: newTotalQuizNumber,
          question_number: newTotalQuestionNumber,
          true_number: newTotalTrueNumber,
          false_number: newTotalFalseNumber,
        },
      }

      set({ user: updatedUser })
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error('Puan güncelleme hatası:', error)
      return false
    }
  },

  addBonusScore: async (bonusPoints) => {
    try {
      const user = get().user
      const points = Math.max(0, Math.floor(Number(bonusPoints) || 0))
      if (!user || points <= 0) return false

      const saved = await addUserBonusScore(user.id, points)
      if (!saved) return false
      const currentUser = get().user || user
      const updatedUser = {
        ...currentUser,
        score: currentUser.score + points,
        lifetime_score: (currentUser.lifetime_score ?? currentUser.score ?? 0) + points,
      }
      set({ user: updatedUser })
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error('Reklam puanı eklenemedi:', error)
      return false
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

      if (user.lives < GAME_RULES.maxLives && minutesPassed >= GAME_RULES.lifeRechargeMinutes) {
        const canEklenecek = Math.floor(minutesPassed / GAME_RULES.lifeRechargeMinutes)
        const yeniCan = Math.min(user.lives + canEklenecek, GAME_RULES.maxLives)
        const yeniTarih = new Date(
          lastUpdate.getTime() + canEklenecek * GAME_RULES.lifeRechargeMinutes * 60 * 1000,
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
    if (user.lives >= GAME_RULES.maxLives) return '00:00'

    const timeUntilNextLife = GAME_RULES.lifeRechargeMinutes * 60 * 1000
    if (!Number.isFinite(lastUpdateTimestamp)) return `${String(GAME_RULES.lifeRechargeMinutes).padStart(2, '0')}:00`

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
      if (!user || user.lives >= GAME_RULES.maxLives || user.score < GAME_RULES.lifePurchaseCost) return false

      const purchased = await purchaseUserLife(
        user.username,
        GAME_RULES.lifePurchaseCost,
        GAME_RULES.maxLives,
      )
      if (!purchased) return false

      const updatedUser = {
        ...user,
        lives: user.lives + 1,
        score: user.score - GAME_RULES.lifePurchaseCost,
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

  updateProfileAvatar: async (avatarId) => {
    try {
      const user = get().user
      if (!user || !AVATARS.some((avatar) => avatar.id === avatarId)) return false
      const ownedAvatars = getOwnedAvatarIds(user.owned_avatars, user.profile)
      if (!ownedAvatars.includes(avatarId)) return false
      const profile = getAvatarProfile(avatarId)
      await updateUserAvatarData(user.id, profile, ownedAvatars)
      const updatedUser = { ...user, profile, owned_avatars: JSON.stringify(ownedAvatars) }
      set({ user: updatedUser })
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error('Profil avatarı güncellenemedi:', error)
      return false
    }
  },

  purchaseProfileAvatar: async (avatarId) => {
    try {
      const user = get().user
      const avatarIndex = AVATARS.findIndex((avatar) => avatar.id === avatarId)
      if (!user || avatarIndex < 0) return { success: false, reason: 'invalid_avatar' }

      const lifetimeScore = user.lifetime_score ?? user.score ?? 0
      const unlockPoints = getAvatarUnlockPoints(avatarIndex)
      const ownedAvatars = getOwnedAvatarIds(user.owned_avatars, user.profile)
      const profile = getAvatarProfile(avatarId)
      if (ownedAvatars.includes(avatarId)) {
        await updateUserAvatarData(user.id, profile, ownedAvatars)
        const updatedUser = { ...user, profile, owned_avatars: JSON.stringify(ownedAvatars) }
        set({ user: updatedUser })
        await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
        return { success: true, purchased: false }
      }

      if (getUnlockedAvatarCount(lifetimeScore) <= avatarIndex) {
        return { success: false, reason: 'locked', unlockPoints }
      }

      const cost = getAvatarPurchaseCost(avatarIndex)
      if (user.score < cost) {
        return { success: false, reason: 'insufficient_points', cost }
      }

      const newlyOwnedAvatars = [...ownedAvatars, avatarId]
      const saved = await purchaseUserAvatar(
        user.id,
        profile,
        cost,
        newlyOwnedAvatars,
      )
      if (!saved) return { success: false, reason: 'insufficient_points', cost }

      const updatedUser = {
        ...user,
        profile,
        score: user.score - cost,
        owned_avatars: JSON.stringify(newlyOwnedAvatars),
      }
      set({ user: updatedUser })
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
      return { success: true, purchased: true, cost }
    } catch (error) {
      console.error('Avatar satın alınamadı:', error)
      return { success: false, reason: 'error' }
    }
  },

  earnLifeFromRewardedAd: async () => {
    try {
      await get().refreshLivesIfNeeded()
      const user = get().user
      if (!user || user.lives >= GAME_RULES.maxLives) return false

      const saved = await grantUserLife(
        user.username,
        GAME_RULES.maxLives,
        new Date().toISOString(),
      )
      if (!saved) return false

      const currentUser = get().user || user

      const updatedUser = {
        ...currentUser,
        lives: currentUser.lives + 1,
        last_life_update: currentUser.last_life_update || new Date().toISOString(),
      }
      set({ user: updatedUser })
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error('Reklam ödülü cana çevrilemedi:', error)
      return false
    }
  },
}))
