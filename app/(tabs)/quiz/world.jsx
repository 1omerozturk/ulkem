import { COLORS } from "@/constants/Colors";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../components/BackButton";
import { worldQuizData } from "../index";

export default function WorldQuizPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.title}>Dünya Quizleri</Text>

        <Text style={styles.subtitle}>
          Ülke - Başkent, kıta ve bayrak testlerini seçin.
        </Text>
        <View style={styles.grid}>
          {worldQuizData.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.card}
              onPress={() => router.push(item.url)}
              activeOpacity={0.9}
            >
              <View style={styles.iconWrap}>
                <Image source={item.path} style={styles.icon} />
              </View>
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 6,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 18,
  },
  grid: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "75%",
    backgroundColor: COLORS.cardBackground,
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 10,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: "hidden",
  },
  icon: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },
  cardText: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
});
