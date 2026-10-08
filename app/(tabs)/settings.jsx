import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/Colors";
import { useGameAudio } from "@/components/GameAudioProvider";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

const settingsRows = [
  {
    key: "musicEnabled",
    title: "Ana menü müziği",
    description: "Menüde düşük sesli, dinlendirici keşif ezgisi.",
    icon: "musical-notes",
    tint: "#E6EFF8",
    color: COLORS.menuWorldAccent,
  },
  {
    key: "soundEffectsEnabled",
    title: "Oyun sesleri",
    description: "Cevap seçimleri ile doğru ve yanlış geri bildirimleri.",
    icon: "volume-high",
    tint: COLORS.authPrimarySoft,
    color: COLORS.authPrimary,
  },
  {
    key: "hapticsEnabled",
    title: "Hafif titreşim",
    description: "Kategori seçerken ve quiz tamamlanınca.",
    icon: "phone-portrait",
    tint: "#FFF1D9",
    color: "#B77825",
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { playSound } = useGameAudio();
  const preferences = {
    musicEnabled: useGameSettingsStore((state) => state.musicEnabled),
    soundEffectsEnabled: useGameSettingsStore((state) => state.soundEffectsEnabled),
    hapticsEnabled: useGameSettingsStore((state) => state.hapticsEnabled),
  };
  const setPreference = useGameSettingsStore((state) => state.setPreference);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
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
                <View style={[styles.settingIcon, { backgroundColor: item.tint }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={styles.settingCopy}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingDescription}>{item.description}</Text>
                </View>
                <Switch
                  value={preferences[item.key]}
                  onValueChange={(value) => setPreference(item.key, value)}
                  trackColor={{ false: "#D8E5DE", true: "#A9D3C0" }}
                  thumbColor={preferences[item.key] ? COLORS.authPrimary : "#FFFFFF"}
                  accessibilityLabel={item.title}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.previewPanel}>
          <Text style={styles.previewTitle}>Sesleri dene</Text>
          <View style={styles.previewRow}>
            {[
              { key: "answerSelect", label: "Seçim", icon: "radio-button-on", color: COLORS.authPrimary, tint: COLORS.authPrimarySoft },
              { key: "correct", label: "Doğru", icon: "checkmark-circle", color: "#26745C", tint: "#E6F1EA" },
              { key: "incorrect", label: "Yanlış", icon: "close-circle", color: "#B9554F", tint: "#F8EAE7" },
            ].map((sound) => (
              <TouchableOpacity
                key={sound.key}
                style={styles.previewChip}
                onPress={() => playSound(sound.key)}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={`${sound.label} sesini dinle`}
              >
                <View style={[styles.previewIcon, { backgroundColor: sound.tint }]}>
                  <Ionicons name={sound.icon} size={17} color={sound.color} />
                </View>
                <Text style={[styles.previewLabel, { color: sound.color }]}>{sound.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.authTextMuted} />
          <Text style={styles.noteText}>
            Tercihlerin bu cihazda saklanır ve uygulamayı yeniden açtığında korunur.
          </Text>
        </View>
        <Text style={styles.credit}>Ses kaynakları: OpenGameArt ve Kenney · CC0</Text>
      </ScrollView>
    </View>
  );
}

const styles = {
  screen: { flex: 1, backgroundColor: COLORS.authBackground },
  content: { flexGrow: 1, alignSelf: "center", width: "100%", maxWidth: 620, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 32 },
  topBar: { height: 46, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: COLORS.authSurface, borderWidth: 1, borderColor: COLORS.authBorder },
  topLabel: { color: COLORS.authPrimary, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  topSpacer: { width: 44 },
  heading: { alignItems: "center", marginTop: 27, marginBottom: 25 },
  headingIcon: { width: 57, height: 57, alignItems: "center", justifyContent: "center", marginBottom: 13, borderRadius: 20, backgroundColor: COLORS.authPrimarySoft },
  title: { color: COLORS.authText, fontSize: 27, lineHeight: 34, fontWeight: "900" },
  subtitle: { maxWidth: 310, marginTop: 5, color: COLORS.authTextMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  settingsCard: { paddingHorizontal: 15, borderRadius: 23, backgroundColor: COLORS.authSurface, borderWidth: 1, borderColor: COLORS.authBorder, shadowColor: COLORS.authShadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 14, elevation: 2 },
  settingRow: { minHeight: 88, flexDirection: "row", alignItems: "center", gap: 11 },
  settingIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14 },
  settingCopy: { flex: 1 },
  settingTitle: { color: COLORS.authText, fontSize: 14, fontWeight: "800" },
  settingDescription: { marginTop: 3, color: COLORS.authTextMuted, fontSize: 11, lineHeight: 16 },
  divider: { height: 1, backgroundColor: COLORS.authBorder },
  previewPanel: { marginTop: 15, padding: 14, borderRadius: 19, backgroundColor: COLORS.authSurface, borderWidth: 1, borderColor: COLORS.authBorder },
  previewRow: { flexDirection: "row", gap: 9, marginTop: 12 },
  previewChip: { flex: 1, minHeight: 65, alignItems: "center", justifyContent: "center", gap: 5, borderRadius: 15, backgroundColor: COLORS.authBackground },
  previewIcon: { width: 31, height: 31, alignItems: "center", justifyContent: "center", borderRadius: 11 },
  previewTitle: { color: COLORS.authText, fontSize: 13, fontWeight: "800" },
  previewLabel: { fontSize: 11, fontWeight: "800" },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 20, paddingHorizontal: 3 },
  noteText: { flex: 1, color: COLORS.authTextMuted, fontSize: 11, lineHeight: 17 },
  credit: { marginTop: 18, color: COLORS.authTextMuted, fontSize: 10, textAlign: "center" },
};
