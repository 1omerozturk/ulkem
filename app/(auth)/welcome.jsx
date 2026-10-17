import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { BRAND, GAME_RULES } from "../../constants/GameConfig";
import Loading from "../../components/Loading";
import { useAuthStore } from "../../store/authStore";
import { useGameSettingsStore } from "../../store/gameSettingsStore";
import { useAppTheme } from "../../hooks/useAppTheme";

const preferences = [
  { key: "musicEnabled", title: "Keşif müziği", description: "Ana menüde sakin bir arka plan müziği.", icon: "musical-notes" },
  { key: "soundEffectsEnabled", title: "Oyun sesleri", description: "Seçim ve cevaplarda kısa sesli bildirimler.", icon: "volume-high" },
  { key: "hapticsEnabled", title: "Hafif titreşim", description: "Bazı seçimlerde ve oyun anlarında küçük dokunuşlar.", icon: "phone-portrait" },
];

const firstSteps = [
  { icon: "compass-outline", title: "Keşfet", description: "Türkiye veya Dünya alanını seç." },
  { icon: "help-circle-outline", title: "Cevapla", description: "10 soruda bilgini ve hızını sına." },
  { icon: "flame-outline", title: "Seri yakala", description: "Doğru cevaplarla combo ve puan kazan." },
];

export default function WelcomeScreen() {
  const { colors: COLORS, styles } = useAppTheme(createWelcomeStyles);
  const router = useRouter();
  const username = useAuthStore((state) => state.user?.username);
  const completeFirstRun = useAuthStore((state) => state.completeFirstRun);
  const hasHydrated = useGameSettingsStore((state) => state.hasHydrated);
  const hydrate = useGameSettingsStore((state) => state.hydrate);
  const setPreference = useGameSettingsStore((state) => state.setPreference);
  const settings = {
    musicEnabled: useGameSettingsStore((state) => state.musicEnabled),
    soundEffectsEnabled: useGameSettingsStore((state) => state.soundEffectsEnabled),
    hapticsEnabled: useGameSettingsStore((state) => state.hapticsEnabled),
  };

  useEffect(() => { hydrate(); }, [hydrate]);

  const startExploring = async () => {
    const saved = await completeFirstRun();
    if (!saved) {
      Alert.alert("Ayarlar kaydedilemedi", "Lütfen tekrar deneyelim.");
      return;
    }
    router.replace("/(tabs)");
  };

  if (!hasHydrated) return <Loading message="Keşif ayarları hazırlanıyor…" />;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}><Ionicons name="compass" size={22} color={COLORS.authPrimary} /></View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandName}>{BRAND.name}</Text>
            <Text style={styles.brandTagline}>BİLGİYLE KEŞFET</Text>
          </View>
          <View style={styles.firstBadge}><Text style={styles.firstBadgeText}>İLK KEŞİF</Text></View>
        </View>

        <LinearGradient colors={[COLORS.authPrimary, COLORS.authPrimaryPressed]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroOrb} />
          <View style={styles.heroCompass}><Ionicons name="navigate" size={26} color={COLORS.authAccent} /></View>
          <Text style={styles.eyebrow}>YOLCULUĞUN BAŞLIYOR</Text>
          <Text style={styles.heroTitle}>Hoş geldin{username ? `, ${username}` : ""}!</Text>
          <Text style={styles.heroText}>Oyun tarzını belirle, sonra ilk keşif rotanı seç.</Text>
          <View style={styles.lifePill}>
            <Ionicons name="heart" size={15} color="#FFCFD0" />
            <Text style={styles.lifeText}>Her oyunda 1 can kullanılır · Canlar {GAME_RULES.lifeRechargeMinutes} dakikada yenilenir</Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionEyebrow}>OYUN REHBERİ</Text><Text style={styles.sectionTitle}>Keşif nasıl oynanır?</Text></View>
          <Ionicons name="sparkles" size={20} color={COLORS.authAccent} />
        </View>

        <View style={styles.stepsCard}>
          {firstSteps.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepIcon}><Ionicons name={step.icon} size={20} color={COLORS.authPrimary} /></View>
              <View style={styles.stepCopy}><Text style={styles.stepTitle}>{step.title}</Text><Text style={styles.stepDescription}>{step.description}</Text></View>
              <Text style={styles.stepNumber}>0{index + 1}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionEyebrow}>SANA GÖRE AYARLA</Text><Text style={styles.sectionTitle}>Oyun tercihlerin</Text></View>
          <Ionicons name="options-outline" size={20} color={COLORS.authPrimary} />
        </View>
        <View style={styles.settingsCard}>
          {preferences.map((item, index) => (
            <View key={item.key}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.preferenceRow}>
                <View style={[styles.preferenceIcon, { backgroundColor: COLORS.authPrimarySoft }]}><Ionicons name={item.icon} size={18} color={COLORS.authPrimary} /></View>
                <View style={styles.preferenceCopy}><Text style={styles.preferenceTitle}>{item.title}</Text><Text style={styles.preferenceDescription}>{item.description}</Text></View>
                <Switch
                  value={settings[item.key]}
                  onValueChange={(value) => setPreference(item.key, value)}
                  trackColor={{ false: COLORS.authBorder, true: COLORS.authPrimarySoft }}
                  thumbColor={settings[item.key] ? COLORS.authPrimary : COLORS.white}
                  accessibilityLabel={item.title}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startExploring} activeOpacity={0.86} accessibilityRole="button">
          <Text style={styles.startButtonText}>Ayarlarımı kaydet ve başla</Text>
          <Ionicons name="arrow-forward" size={19} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.footerNote}>Bu ekranı yalnızca ilk girişinde göreceksin. Ayarlarını daha sonra Profil bölümünden değiştirebilirsin.</Text>
      </ScrollView>
    </View>
  );
}

const createWelcomeStyles = (COLORS) => ({
  screen: { flex: 1, backgroundColor: COLORS.authBackground },
  content: { flexGrow: 1, alignSelf: "center", width: "100%", maxWidth: 620, paddingHorizontal: 21, paddingTop: 12, paddingBottom: 28 },
  brandRow: { height: 48, flexDirection: "row", alignItems: "center", marginBottom: 13 },
  brandIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.authPrimarySoft },
  brandCopy: { marginLeft: 10, flex: 1 },
  brandName: { color: COLORS.authText, fontSize: 14, fontWeight: "900" },
  brandTagline: { color: COLORS.authTextMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1.1, marginTop: 2 },
  firstBadge: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 11, backgroundColor: "#FFF1D9" },
  firstBadgeText: { color: "#A56A24", fontSize: 9, fontWeight: "900", letterSpacing: 0.6 },
  hero: { minHeight: 208, padding: 20, borderRadius: 25, overflow: "hidden", justifyContent: "center" },
  heroOrb: { position: "absolute", width: 180, height: 180, right: -76, top: -93, borderRadius: 90, backgroundColor: "#FFFFFF16" },
  heroCompass: { position: "absolute", right: 19, top: 20, width: 47, height: 47, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF26", borderWidth: 1, borderColor: "#FFFFFF38" },
  eyebrow: { color: "#D4E9DE", fontSize: 9, fontWeight: "900", letterSpacing: 1.3 },
  heroTitle: { color: COLORS.white, fontSize: 24, lineHeight: 30, fontWeight: "900", marginTop: 5, maxWidth: "82%" },
  heroText: { color: "#FFFFFFE8", fontSize: 12, lineHeight: 18, marginTop: 3, maxWidth: 260 },
  lifePill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 7, marginTop: 13, borderRadius: 12, backgroundColor: "#FFFFFF20" },
  lifeText: { color: COLORS.white, fontSize: 9, fontWeight: "700" },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 19, marginBottom: 10, paddingHorizontal: 2 },
  sectionEyebrow: { color: COLORS.authTextMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  sectionTitle: { color: COLORS.authText, fontSize: 16, fontWeight: "900", marginTop: 2 },
  stepsCard: { paddingHorizontal: 13, borderRadius: 19, backgroundColor: COLORS.authSurface, borderWidth: 1, borderColor: COLORS.authBorder },
  stepRow: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 10 },
  stepIcon: { width: 35, height: 35, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.authPrimarySoft },
  stepCopy: { flex: 1 },
  stepTitle: { color: COLORS.authText, fontSize: 12, fontWeight: "900" },
  stepDescription: { color: COLORS.authTextMuted, fontSize: 10, marginTop: 2 },
  stepNumber: { color: COLORS.authBorder, fontSize: 12, fontWeight: "900" },
  settingsCard: { paddingHorizontal: 13, borderRadius: 19, backgroundColor: COLORS.authSurface, borderWidth: 1, borderColor: COLORS.authBorder },
  preferenceRow: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: 10 },
  preferenceIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  preferenceCopy: { flex: 1 },
  preferenceTitle: { color: COLORS.authText, fontSize: 12, fontWeight: "900" },
  preferenceDescription: { color: COLORS.authTextMuted, fontSize: 9, lineHeight: 13, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.authBorder },
  startButton: { minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 18, borderRadius: 17, backgroundColor: COLORS.authPrimary, shadowColor: COLORS.authShadow, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.16, shadowRadius: 10, elevation: 3 },
  startButtonText: { color: COLORS.white, fontSize: 13, fontWeight: "900" },
  footerNote: { color: COLORS.authTextMuted, fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 11, paddingHorizontal: 9 },
});
