import styles from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export const worldQuizData = [
  {
    title: "Başkent Ustası",
    description: "Ülkeleri başkentleriyle eşleştir.",
    icon: "business-outline",
    url: "quiz/country-capital",
  },
  {
    title: "Kıta Kaşifi",
    description: "Ülkelerin hangi kıtada olduğunu bul.",
    icon: "earth-outline",
    url: "quiz/country-continent",
  },
  {
    title: "Bayrak Dedektifi",
    description: "Bayrağı gör, ülkeyi tahmin et.",
    icon: "flag-outline",
    url: "quiz/country-flag",
  },
];

export const turkeyQuizData = [
  {
    title: "Plaka Avcısı",
    description: "Kodundan şehri, şehrinden plakayı bul.",
    icon: "car-sport-outline",
    url: "quiz/plate",
  },
  {
    title: "Bölge Bilgini Sına",
    description: "Şehirleri doğru coğrafi bölgeye yerleştir.",
    icon: "navigate-outline",
    url: "quiz/region",
  },
  {
    title: "İlçe Kaşifi",
    description: "İlçelerin hangi şehre bağlı olduğunu keşfet.",
    icon: "location-outline",
    url: "quiz/district",
  },
  {
    title: "Büyükşehir Bilgisi",
    description: "Büyükşehir statüsündeki illeri tanı.",
    icon: "business-outline",
    url: "quiz/metropolitan",
  },
  {
    title: "Haritada İli Bul",
    description: "Haritadaki vurguyu incele ve doğru ili seç.",
    icon: "map-outline",
    url: "quiz/map-province",
  },
];

export const data = { world: worldQuizData, turkey: turkeyQuizData };

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const refreshLivesIfNeeded = useAuthStore(
    (state) => state.refreshLivesIfNeeded,
  );

  useEffect(() => {
    refreshLivesIfNeeded();
  }, [refreshLivesIfNeeded]);

  const username = user?.username || "Gezgin";
  const lives = user?.lives ?? 0;
  const score = user?.score ?? 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}>
              <Image
                source={require("@/assets/brand/ulkem-mark.png")}
                style={{ width: 43, height: 43 }}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.brandName}>ÜLKEM</Text>
              <Text style={styles.brandCaption}>BİLGİ OYUNU</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.livesChip}
            onPress={() => router.push("/life")}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${lives} canın var. Canlarını yönet`}
          >
            <Ionicons name="heart" size={18} color={COLORS.authError} />
            <Text style={styles.livesChipValue}>{lives}</Text>
            <Text style={styles.livesChipLimit}>/10</Text>
            <Ionicons
              name="add-circle"
              size={18}
              color={COLORS.authPrimary}
              style={styles.livesChipAction}
            />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[COLORS.authPrimary, "#104F44"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroCopy}>
            <Text style={styles.heroGreeting}>Hazır mısın, {username}?</Text>
            <Text style={styles.heroTitle}>Keşfet.{"\n"}Öğren. Yarış.</Text>
            <Text style={styles.heroSubtitle}>
              Her soru yeni bir keşif, her doğru cevap yeni puanlar.
            </Text>
          </View>
          <View pointerEvents="none" style={styles.heroArtwork}>
            <View style={styles.heroOrbit} />
            <Image
              source={require("@/assets/brand/ulkem-mark.png")}
              style={styles.heroWorldImage}
              resizeMode="contain"
            />
            <View style={styles.heroSparkle}>
              <Ionicons name="sparkles" size={21} color={COLORS.authAccent} />
            </View>
          </View>
          <View style={styles.heroScore}>
            <Ionicons name="trophy" size={16} color={COLORS.authAccent} />
            <Text style={styles.heroScoreLabel}>TOPLAM PUAN</Text>
            <Text style={styles.heroScoreValue}>
              {score.toLocaleString("tr-TR")}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>OYUN ALANINI SEÇ</Text>
            <Text style={styles.sectionTitle}>Nereyi keşfediyoruz?</Text>
          </View>
          <Ionicons
            name="game-controller-outline"
            size={25}
            color={COLORS.authPrimary}
          />
        </View>

        <TouchableOpacity
          style={[styles.categoryCard, styles.worldCard]}
          onPress={() => router.push("/quiz/world")}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Dünya quizlerini aç. 3 kategori"
        >
          <View style={[styles.categoryIcon, styles.worldIcon]}>
            <Image
              source={require("@/assets/images/u_icons/world.png")}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.categoryCopy}>
            <Text style={[styles.categoryEyebrow, styles.worldEyebrow]}>
              DÜNYAYI KEŞFET
            </Text>
            <Text style={styles.categoryTitle}>Dünya</Text>
            <Text style={styles.categorySubtitle}>
              Ülkeler, başkentler ve bayraklar
            </Text>
            <View style={styles.categoryMeta}>
              <Text style={[styles.categoryCount, styles.worldCount]}>
                3 QUIZ KATEGORİSİ
              </Text>
            </View>
          </View>
          <View style={[styles.categoryAction, styles.worldAction]}>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={COLORS.menuWorldAccent}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryCard, styles.turkeyCard]}
          onPress={() => router.push("/quiz/turkey")}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Türkiye quizlerini aç. 5 kategori"
        >
          <View style={[styles.categoryIcon, styles.turkeyIcon]}>
            <Image
              source={require("@/assets/images/u_icons/tr_round.png")}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.categoryCopy}>
            <Text style={[styles.categoryEyebrow, styles.turkeyEyebrow]}>
              YAKINDAN TANI
            </Text>
            <Text style={styles.categoryTitle}>Türkiye</Text>
            <Text style={styles.categorySubtitle}>
              Şehirler, bölgeler ve ilçeler
            </Text>
            <View style={styles.categoryMeta}>
              <Text style={[styles.categoryCount, styles.turkeyCount]}>
                5 QUIZ KATEGORİSİ
              </Text>
            </View>
          </View>
          <View style={[styles.categoryAction, styles.turkeyAction]}>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={COLORS.menuTurkeyAccent}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.footerNote}>
          <Ionicons name="sparkles" size={17} color={COLORS.authAccent} />
          <Text style={styles.footerNoteText}>
            Küçük bir quiz, kocaman bir keşif.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
