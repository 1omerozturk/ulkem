import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import styles from "../assets/styles/profile.styles";
import { COLORS } from "../constants/Colors";
import { useAuthStore } from "../store/authStore";

const statistics = [
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
    background: "#E5F2E9",
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
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const refreshLivesIfNeeded = useAuthStore(
    (state) => state.refreshLivesIfNeeded,
  );

  useEffect(() => {
    refreshLivesIfNeeded();
  }, [refreshLivesIfNeeded]);

  const quizData = user?.quizData ?? {};
  const completedQuizCount = Number(quizData.quiz_number ?? 0);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeading}>
        <Text style={styles.pageTitle}>Profilim</Text>
        <Text style={styles.pageSubtitle}>
          Yolculuğundaki ilerlemeye göz at.
        </Text>
      </View>

      <Animated.View
        entering={FadeInUp.duration(350)}
        style={styles.profileCard}
      >
        <View style={styles.profileTopRow}>
          <View style={styles.avatar}>
            {user?.profile ? (
              <Image
                source={{ uri: user.profile }}
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons name="person" size={34} color={COLORS.authPrimary} />
            )}
          </View>
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
              <Text style={styles.memberText}>Ülkem kaşifi</Text>
            </View>
          </View>
        </View>

        <View style={styles.scorePanel}>
          <View style={styles.scoreIcon}>
            <Ionicons name="trophy" size={20} color={COLORS.authAccent} />
          </View>
          <View style={styles.scoreCopy}>
            <Text style={styles.scoreLabel}>Toplam puan</Text>
            <Text style={styles.scoreValue}>
              {(user?.score ?? 0).toLocaleString("tr-TR")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.livesButton}
            onPress={() => router.push("/life")}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Canlarını yönet"
          >
            <Ionicons name="heart" size={17} color={COLORS.authError} />
            <Text style={styles.livesText}>{user?.lives ?? 0}/10</Text>
            <Ionicons
              name="chevron-forward"
              size={15}
              color={COLORS.authTextMuted}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {completedQuizCount < 1 ? (
        <Animated.View
          entering={FadeInUp.delay(100).duration(350)}
          style={styles.emptyState}
        >
          <View style={styles.emptyIllustration}>
            <Image
              source={require("@/assets/brand/ulkem-mark.png")}
              style={styles.avatarImage}
              resizeMode="contain"
            />
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
    </ScrollView>
  );
}
