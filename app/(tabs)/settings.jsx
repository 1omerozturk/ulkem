import { useGameAudio } from "@/components/GameAudioProvider";
import NoticeModal from "@/components/NoticeModal";
import { THEMES } from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/store/authStore";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  BackHandler,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const settingsRows = [
  {
    key: "musicEnabled",
    title: "Ana menü müziği",
    description: "Menüde düşük sesli, dinlendirici keşif ezgisi.",
    icon: "musical-notes",
    tint: "menuWorld",
    color: "menuWorldAccent",
  },
  {
    key: "soundEffectsEnabled",
    title: "Oyun sesleri",
    description: "Cevap seçimleri ile doğru ve yanlış geri bildirimleri.",
    icon: "volume-high",
    tint: "authPrimarySoft",
    color: "authPrimary",
  },
  {
    key: "hapticsEnabled",
    title: "Hafif titreşim",
    description: "Kategori seçerken ve quiz tamamlanınca.",
    icon: "phone-portrait",
    tint: "authAccent",
    color: "authText",
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { colors: COLORS, styles } = useAppTheme(createStyles);
  const { playSound } = useGameAudio();
  const logout = useAuthStore((state) => state.logout);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const themeId = useGameSettingsStore((state) => state.themeId);
  const preferences = {
    musicEnabled: useGameSettingsStore((state) => state.musicEnabled),
    soundEffectsEnabled: useGameSettingsStore(
      (state) => state.soundEffectsEnabled,
    ),
    hapticsEnabled: useGameSettingsStore((state) => state.hapticsEnabled),
  };
  const setPreference = useGameSettingsStore((state) => state.setPreference);
  const setTheme = useGameSettingsStore((state) => state.setTheme);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/(tabs)/profile");
        return true;
      },
    );
    return () => subscription.remove();
  }, [router]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)/profile")}
            accessibilityRole="button"
            accessibilityLabel="Profile dön"
          >
            <Ionicons name="arrow-back" size={21} color={COLORS.authText} />
          </TouchableOpacity>
          <Text style={styles.topLabel}>YURTPUSULA</Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.heading}>
          <View style={styles.headingIcon}>
            <Ionicons name="options" size={25} color={COLORS.authPrimary} />
          </View>
          <Text style={styles.title}>Oyun ayarları</Text>
          <Text style={styles.subtitle}>
            Keşif yolculuğunun sesini ve titreşimini kendine göre düzenle.
          </Text>
        </View>

        <View style={styles.settingsCard}>
          {settingsRows.map((item, index) => (
            <View key={item.key}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.settingRow}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: COLORS[item.tint] },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={COLORS[item.color]}
                  />
                </View>
                <View style={styles.settingCopy}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingDescription}>
                    {item.description}
                  </Text>
                </View>
                <Switch
                  value={preferences[item.key]}
                  onValueChange={(value) => setPreference(item.key, value)}
                  trackColor={{
                    false: COLORS.authBorder,
                    true: COLORS.authPrimarySoft,
                  }}
                  thumbColor={
                    preferences[item.key] ? COLORS.authPrimary : COLORS.white
                  }
                  accessibilityLabel={item.title}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.themePanel}>
          <View style={styles.themeHeading}>
            <View style={styles.themeHeadingIcon}>
              <Ionicons
                name="color-palette"
                size={19}
                color={COLORS.authPrimary}
              />
            </View>
            <View style={styles.themeHeadingCopy}>
              <Text style={styles.themeTitle}>Dünyanı seç</Text>
              <Text style={styles.themeSubtitle}>
                Teman anında değişir, tercihin bu cihazda saklanır.
              </Text>
            </View>
          </View>
          <View style={styles.themeGrid}>
            {Object.values(THEMES).map((item) => {
              const selected = item.id === themeId;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.themeOption,
                    selected && {
                      borderColor: item.colors.authPrimary,
                      backgroundColor: item.colors.authSurfaceTint,
                    },
                  ]}
                  onPress={() => setTheme(item.id)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name} temasını seç`}
                  accessibilityState={{ selected }}
                >
                  <View
                    style={[
                      styles.themeSwatch,
                      { backgroundColor: item.colors.authBackground },
                    ]}
                  >
                    <View
                      style={[
                        styles.themeSwatchCard,
                        {
                          backgroundColor: item.colors.authSurface,
                          borderColor: item.colors.authBorder,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.themeSwatchLine,
                          { backgroundColor: item.colors.authPrimary },
                        ]}
                      />
                      <View
                        style={[
                          styles.themeSwatchDot,
                          { backgroundColor: item.colors.authAccent },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.themeOptionCopy}>
                    <Text
                      style={[
                        styles.themeOptionTitle,
                        { color: COLORS.authText },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.themeOptionDescription,
                        { color: COLORS.authTextMuted },
                      ]}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.themeOptionIcon,
                      { backgroundColor: item.colors.authPrimarySoft },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={item.colors.authPrimary}
                    />
                    {selected ? (
                      <View
                        style={[
                          styles.themeSelectedDot,
                          { backgroundColor: item.colors.authPrimary },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={10}
                          color={item.colors.white}
                        />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.previewPanel}>
          <Text style={styles.previewTitle}>Sesleri dene</Text>
          <View style={styles.previewRow}>
            {[
              {
                key: "answerSelect",
                label: "Seçim",
                icon: "radio-button-on",
                color: COLORS.authPrimary,
                tint: COLORS.authPrimarySoft,
              },
              {
                key: "correct",
                label: "Doğru",
                icon: "checkmark-circle",
                color: COLORS.authSuccess,
                tint: `${COLORS.authSuccess}22`,
              },
              {
                key: "incorrect",
                label: "Yanlış",
                icon: "close-circle",
                color: COLORS.authError,
                tint: `${COLORS.authError}22`,
              },
            ].map((sound) => (
              <TouchableOpacity
                key={sound.key}
                style={styles.previewChip}
                onPress={() => playSound(sound.key)}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={`${sound.label} sesini dinle`}
              >
                <View
                  style={[styles.previewIcon, { backgroundColor: sound.tint }]}
                >
                  <Ionicons name={sound.icon} size={17} color={sound.color} />
                </View>
                <Text style={[styles.previewLabel, { color: sound.color }]}>
                  {sound.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.note}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.authTextMuted}
          />
          <Text style={styles.noteText}>
            Tercihlerin bu cihazda saklanır ve uygulamayı yeniden açtığında
            korunur.
          </Text>
        </View>
        <View style={styles.accountPanel}>
          <View style={styles.accountCopy}>
            <Text style={styles.accountTitle}>Hesap</Text>
            <Text style={styles.accountDescription}>
              YurtPusula hesabından çıkış yap.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setConfirmLogout(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Hesaptan çıkış yap"
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color={COLORS.authError}
            />
            <Text style={styles.logoutText}>Çıkış yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NoticeModal
        visible={confirmLogout}
        title="Yolculuktan çıkalım mı?"
        message="Hesabından çıkış yapacaksın. Dilediğinde tekrar giriş yapabilirsin."
        icon="log-out-outline"
        confirmLabel="Çıkış yap"
        cancelLabel="Oyunda kal"
        destructive
        onCancel={() => setConfirmLogout(false)}
        onConfirm={logout}
      />
    </View>
  );
}

const createStyles = (COLORS) => ({
  screen: { flex: 1, backgroundColor: COLORS.authBackground },
  content: {
    flexGrow: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 620,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 32,
  },
  topBar: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: COLORS.authSurface,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
  },
  topLabel: {
    color: COLORS.authPrimary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  topSpacer: { width: 44 },
  heading: { alignItems: "center", marginTop: 27, marginBottom: 25 },
  headingIcon: {
    width: 57,
    height: 57,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
    borderRadius: 20,
    backgroundColor: COLORS.authPrimarySoft,
  },
  title: {
    color: COLORS.authText,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "900",
  },
  subtitle: {
    maxWidth: 310,
    marginTop: 5,
    color: COLORS.authTextMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  settingsCard: {
    paddingHorizontal: 15,
    borderRadius: 23,
    backgroundColor: COLORS.authSurface,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
    shadowColor: COLORS.authShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  settingRow: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  settingIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  settingCopy: { flex: 1 },
  settingTitle: { color: COLORS.authText, fontSize: 14, fontWeight: "800" },
  settingDescription: {
    marginTop: 3,
    color: COLORS.authTextMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  divider: { height: 1, backgroundColor: COLORS.authBorder },
  previewPanel: {
    marginTop: 15,
    padding: 14,
    borderRadius: 19,
    backgroundColor: COLORS.authSurface,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
  },
  previewRow: { flexDirection: "row", gap: 9, marginTop: 12 },
  previewChip: {
    flex: 1,
    minHeight: 65,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 15,
    backgroundColor: COLORS.authBackground,
  },
  previewIcon: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
  },
  previewTitle: { color: COLORS.authText, fontSize: 13, fontWeight: "800" },
  previewLabel: { fontSize: 11, fontWeight: "800" },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 3,
  },
  noteText: {
    flex: 1,
    color: COLORS.authTextMuted,
    fontSize: 11,
    lineHeight: 17,
  },
  credit: {
    marginTop: 18,
    color: COLORS.authTextMuted,
    fontSize: 10,
    textAlign: "center",
  },
  accountPanel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
    padding: 15,
    borderRadius: 19,
    backgroundColor: COLORS.authSurface,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
  },
  accountCopy: { flex: 1 },
  accountTitle: { color: COLORS.authText, fontSize: 14, fontWeight: "800" },
  accountDescription: {
    marginTop: 3,
    color: COLORS.authTextMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  logoutButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 11,
    borderRadius: 13,
    backgroundColor: `${COLORS.authError}12`,
    borderWidth: 1,
    borderColor: `${COLORS.authError}35`,
  },
  logoutText: { color: COLORS.authError, fontSize: 12, fontWeight: "800" },
  themePanel: {
    marginTop: 15,
    padding: 14,
    borderRadius: 19,
    backgroundColor: COLORS.authSurface,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
  },
  themeHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  themeHeadingIcon: {
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: COLORS.authPrimarySoft,
  },
  themeHeadingCopy: { flex: 1 },
  themeTitle: { color: COLORS.authText, fontSize: 15, fontWeight: "900" },
  themeSubtitle: {
    color: COLORS.authTextMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  themeOption: {
    width: "48.5%",
    minHeight: 137,
    padding: 9,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.authBorder,
    backgroundColor: COLORS.authInput,
  },
  themeSwatch: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    overflow: "hidden",
  },
  themeSwatchCard: {
    width: "74%",
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeSwatchLine: { width: "55%", height: 7, borderRadius: 4 },
  themeSwatchDot: { width: 13, height: 13, borderRadius: 7 },
  themeOptionCopy: { marginTop: 7 },
  themeOptionTitle: { fontSize: 12, fontWeight: "900" },
  themeOptionDescription: { fontSize: 9, lineHeight: 13, marginTop: 2 },
  themeOptionIcon: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 27,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },
  themeSelectedDot: {
    position: "absolute",
    right: -5,
    bottom: -5,
    width: 15,
    height: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
