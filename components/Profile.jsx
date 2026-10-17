import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { createStyles } from "../assets/styles/profile.styles";
import { BRAND, GAME_RULES } from "../constants/GameConfig";
import BrandMark from "./BrandMark";
import { useAuthStore } from "../store/authStore";
import {
  AVATARS,
  getAvatarId,
  getAvatarPurchaseCost,
  getAvatarUnlockPoints,
  getOwnedAvatarIds,
  getNextAvatarUnlock,
  getUnlockedAvatarCount,
} from "../constants/Avatars";
import LocalAvatar from "./LocalAvatar";
import { useAppTheme } from "../hooks/useAppTheme";
import NoticeModal from "./NoticeModal";
import BuyLive from "./BuyLive";
import LifeTimer from "./LifeTimer";

const getStatistics = (COLORS) => [
  {
    key: "quiz_number",
    label: "Tamamlanan quiz",
    icon: "library-outline",
    color: COLORS.menuWorldAccent,
    background: COLORS.menuWorld,
  },
  {
    key: "question_number",
    label: "Yanıtlanan soru",
    icon: "help-circle-outline",
    color: COLORS.authPrimary,
    background: COLORS.authPrimarySoft,
  },
  {
    key: "true_number",
    label: "Doğru yanıt",
    icon: "checkmark-circle-outline",
    color: COLORS.authSuccess,
    background: `${COLORS.authSuccess}22`,
  },
  {
    key: "false_number",
    label: "Yanlış yanıt",
    icon: "close-circle-outline",
    color: COLORS.menuTurkeyAccent,
    background: COLORS.menuTurkey,
  },
];

export default function Profile() {
  const { colors: COLORS, styles } = useAppTheme(createStyles);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateProfileAvatar = useAuthStore((state) => state.updateProfileAvatar);
  const purchaseProfileAvatar = useAuthStore((state) => state.purchaseProfileAvatar);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [avatarPurchaseCandidate, setAvatarPurchaseCandidate] = useState(null);
  const [avatarActionMessage, setAvatarActionMessage] = useState("");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  const quizData = user?.quizData ?? {};
  const completedQuizCount = Number(quizData.quiz_number ?? 0);
  const statistics = getStatistics(COLORS);
  const selectedAvatarId = getAvatarId(user?.profile);
  const lifetimeScore = Number(user?.lifetime_score ?? user?.score ?? 0);
  const availablePoints = Number(user?.score ?? 0);
  const ownedAvatarIds = getOwnedAvatarIds(user?.owned_avatars, user?.profile);
  const selectedAvatarIndex = AVATARS.findIndex((avatar) => avatar.id === selectedAvatarId);
  // Grandfather an avatar already equipped by an existing player.
  const unlockedAvatarCount = Math.max(
    getUnlockedAvatarCount(lifetimeScore),
    selectedAvatarIndex + 1,
  );
  const nextAvatarUnlock = getNextAvatarUnlock(lifetimeScore, unlockedAvatarCount);

  const selectAvatar = async (avatarId) => {
    if (isSavingAvatar) return;
    setIsSavingAvatar(true);
    setAvatarActionMessage("");
    let result;
    if (ownedAvatarIds.includes(avatarId)) {
      const saved = await updateProfileAvatar(avatarId);
      result = saved ? { success: true, purchased: false } : { success: false, reason: "error" };
    } else {
      result = await purchaseProfileAvatar(avatarId);
    }
    setIsSavingAvatar(false);
    if (result.success) {
      setAvatarPickerVisible(false);
      return;
    }

    if (result.reason === "insufficient_points") {
      setAvatarActionMessage(`Bu avatar için ${result.cost.toLocaleString("tr-TR")} puan gerekiyor. Puan bakiyen: ${availablePoints.toLocaleString("tr-TR")}.`);
    } else {
      setAvatarActionMessage("Avatar işlemi tamamlanamadı. Yeniden deneyebilirsin.");
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeading}>
        <View style={styles.pageHeadingCopy}>
          <Text style={styles.pageTitle}>Profilim</Text>
          <Text style={styles.pageSubtitle}>
            Yolculuğundaki ilerlemeye göz at.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/(tabs)/settings")}
          activeOpacity={0.82}
          accessibilityRole="button"
          accessibilityLabel="Oyun ayarlarını aç"
        >
          <Ionicons name="settings-outline" size={21} color={COLORS.authPrimary} />
        </TouchableOpacity>
      </View>

      <Animated.View
        entering={FadeInUp.duration(350)}
        style={styles.profileCard}
      >
        <View style={styles.profileTopRow}>
          <LocalAvatar profile={user?.profile} style={styles.avatar} />
          <View style={styles.identity}>
            <Text style={styles.username} numberOfLines={1}>
              {user?.username || "Gezgin"}
            </Text>
            <View style={styles.memberBadge}>
              <Ionicons
                name="compass-outline"
                size={14}
                color={COLORS.authPrimary}
              />
              <Text style={styles.memberText}>{BRAND.explorerTitle}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.avatarEditButton}
          onPress={() => setAvatarPickerVisible(true)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Profil avatarını değiştir"
        >
          <Ionicons name="color-palette-outline" size={16} color={COLORS.authPrimary} />
          <Text style={styles.avatarEditText}>Avatarını seç</Text>
        </TouchableOpacity>

        <View style={styles.scorePanel}>
          <View style={styles.scoreIcon}>
            <Ionicons name="trophy" size={20} color={COLORS.authAccent} />
          </View>
          <View style={styles.scoreCopy}>
            <Text style={styles.scoreLabel}>Kazanılan puan</Text>
            <Text style={styles.scoreValue}>
              {lifetimeScore.toLocaleString("tr-TR")}
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(70).duration(350)}
        style={styles.lifeSection}
      >
        <View style={styles.lifeSectionHeading}>
          <View style={styles.lifeSectionTitleRow}>
            <Ionicons name="heart" size={17} color={COLORS.authError} />
            <Text style={styles.lifeSectionTitle}>Can istasyonu</Text>
          </View>
          <Text style={styles.lifeSectionSubtitle}>
            {user?.lives < GAME_RULES.maxLives
              ? "Canlarını izle; istersen reklamla hemen bir tane kazan."
              : "Canların dolu. Yeni bir keşfe hazırsın!"}
          </Text>
        </View>
        <LifeTimer />
        <BuyLive />
      </Animated.View>

      {completedQuizCount < 1 ? (
        <Animated.View
          entering={FadeInUp.delay(100).duration(350)}
          style={styles.emptyState}
        >
          <View style={styles.emptyIllustration}>
            <BrandMark style={styles.avatarImage} />
            <View style={styles.emptySparkle}>
              <Ionicons name="sparkles" size={17} color={COLORS.authAccent} />
            </View>
          </View>
          <Text style={styles.emptyEyebrow}>YENİ BİR MACERA</Text>
          <Text style={styles.emptyTitle}>İlk keşfin seni bekliyor!</Text>
          <Text style={styles.emptyDescription}>
            Bir quiz tamamladığında puanların ve oyun istatistiklerin burada
            birikmeye başlayacak.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Ana sayfaya git ve ilk oyununu seç"
          >
            <Ionicons name="play" size={17} color={COLORS.white} />
            <Text style={styles.emptyButtonText}>İlk oyununu seç</Text>
            <Ionicons name="arrow-forward" size={17} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.emptyHint}>
            <Ionicons
              name="globe-outline"
              size={16}
              color={COLORS.menuWorldAccent}
            />
            <Text style={styles.emptyHintText}>
              Dünya veya Türkiye quizleri
            </Text>
          </View>
        </Animated.View>
      ) : (
        <View>
          <View style={styles.statisticsHeading}>
            <Text style={styles.sectionTitle}>Quiz istatistikleri</Text>
            <Text style={styles.sectionSubtitle}>
              Her deneme seni biraz daha ileri taşır.
            </Text>
          </View>

          <View style={styles.statisticsGrid}>
            {statistics.map((item, index) => (
              <Animated.View
                key={item.key}
                entering={FadeIn.delay(index * 70).duration(300)}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: item.background },
                  ]}
                >
                  <Ionicons name={item.icon} size={21} color={item.color} />
                </View>
                <Text style={styles.statValue}>
                  {(quizData[item.key] ?? 0).toLocaleString("tr-TR")}
                </Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
      )}

      <Modal
        visible={avatarPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarPickerVisible(false)}
      >
        <View style={styles.avatarModalBackdrop}>
          <Pressable
            style={styles.avatarModalDismiss}
            onPress={() => setAvatarPickerVisible(false)}
            accessibilityLabel="Avatar seçimini kapat"
          />
          <View style={styles.avatarModal}>
            <View style={styles.avatarModalHeading}>
              <View style={styles.avatarModalCopy}>
                <Text style={styles.avatarModalTitle}>Avatarını seç</Text>
              <Text style={styles.avatarModalSubtitle}>İlerle, kilitleri aç ve sevdiğin avatarı puanla al.</Text>
              </View>
              <TouchableOpacity
                style={styles.avatarModalClose}
                onPress={() => setAvatarPickerVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Kapat"
              >
                <Ionicons name="close" size={21} color={COLORS.authTextMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarProgressPanel}>
              <Text style={styles.avatarProgressTitle}>
                {ownedAvatarIds.length} avatar sende · {unlockedAvatarCount} avatar açıldı
              </Text>
              <Text style={styles.avatarProgressDetail}>
                {nextAvatarUnlock
                  ? `${lifetimeScore.toLocaleString("tr-TR")} toplam puan · ${availablePoints.toLocaleString("tr-TR")} harcanabilir puan · ${nextAvatarUnlock.remaining.toLocaleString("tr-TR")} puan sonra ${nextAvatarUnlock.count} avatar açılır.`
                  : `${lifetimeScore.toLocaleString("tr-TR")} toplam puan · ${availablePoints.toLocaleString("tr-TR")} harcanabilir puan · Tüm avatarlar açıldı!`}
              </Text>
            </View>

            <ScrollView
              style={styles.avatarGridScroll}
              contentContainerStyle={styles.avatarGrid}
              showsVerticalScrollIndicator={false}
            >
              {AVATARS.map((avatar, index) => {
                const selected = avatar.id === selectedAvatarId;
                const owned = ownedAvatarIds.includes(avatar.id);
                const unlocked = index < unlockedAvatarCount;
                const unlockPoints = getAvatarUnlockPoints(index);
                const purchaseCost = getAvatarPurchaseCost(index);
                return (
                  <TouchableOpacity
                    key={avatar.id}
                    style={[
                      styles.avatarOption,
                      selected && styles.avatarOptionSelected,
                      !unlocked && styles.avatarOptionLocked,
                      unlocked && !owned && styles.avatarOptionForSale,
                    ]}
                    onPress={() => {
                      if (!unlocked) return;
                      if (owned) selectAvatar(avatar.id);
                      else setAvatarPurchaseCandidate(avatar);
                    }}
                    activeOpacity={0.78}
                    disabled={isSavingAvatar || !unlocked}
                    accessibilityRole="button"
                    accessibilityLabel={unlocked && owned
                      ? `${avatar.name} avatarını seç`
                      : unlocked
                        ? `${avatar.name} avatarını ${purchaseCost.toLocaleString("tr-TR")} puana satın al`
                        : `${avatar.name} avatarı ${unlockPoints.toLocaleString("tr-TR")} puanla açılır`}
                    accessibilityState={{ selected, disabled: isSavingAvatar || !unlocked }}
                  >
                    <View style={styles.avatarOptionIconWrap}>
                      <LocalAvatar avatarId={avatar.id} size={54} />
                      {!unlocked ? (
                        <View style={styles.avatarLockedOverlay}>
                          <Ionicons name="lock-closed" size={18} color={COLORS.white} />
                        </View>
                      ) : !owned ? (
                        <View style={styles.avatarPurchaseBadge}>
                          <Ionicons name="cart" size={12} color={COLORS.white} />
                        </View>
                      ) : selected ? (
                        <View style={styles.avatarSelectedCheck}>
                          <Ionicons name="checkmark" size={12} color={COLORS.white} />
                        </View>
                      ) : null}
                    </View>
                    <Text style={[styles.avatarOptionName, selected && styles.avatarOptionNameSelected]}>{avatar.name}</Text>
                    {!unlocked ? (
                      <Text style={styles.avatarUnlockCost}>{unlockPoints.toLocaleString("tr-TR")} puanda açılır</Text>
                    ) : !owned ? (
                      <Text style={styles.avatarPurchaseCost}>{purchaseCost.toLocaleString("tr-TR")} puan · Al</Text>
                    ) : (
                      <Text style={styles.avatarOwnedLabel}>{selected ? "Seçili" : "Sende"}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {avatarActionMessage ? <Text style={styles.avatarSaveError}>{avatarActionMessage}</Text> : null}
            {isSavingAvatar ? <Text style={styles.avatarSavingText}>Avatar kaydediliyor…</Text> : null}
          </View>
        </View>
      </Modal>
      <NoticeModal
        visible={!!avatarPurchaseCandidate}
        title={avatarPurchaseCandidate ? `${avatarPurchaseCandidate.name} avatarı alınsın mı?` : ""}
        message={avatarPurchaseCandidate
          ? `${getAvatarPurchaseCost(AVATARS.findIndex((avatar) => avatar.id === avatarPurchaseCandidate.id)).toLocaleString("tr-TR")} puan harcanacak. Mevcut bakiyen: ${availablePoints.toLocaleString("tr-TR")} puan.`
          : ""}
        icon="cart"
        confirmLabel="Puanla al"
        cancelLabel="Vazgeç"
        onCancel={() => setAvatarPurchaseCandidate(null)}
        onConfirm={() => {
          const avatar = avatarPurchaseCandidate;
          setAvatarPurchaseCandidate(null);
          if (avatar) selectAvatar(avatar.id);
        }}
      />
    </ScrollView>
  );
}
