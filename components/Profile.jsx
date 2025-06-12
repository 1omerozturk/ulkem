import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../constants/Colors";
import { useAuthStore } from "../store/authStore";
import BuyLive from "./BuyLive";
import BackButton from "./BackButton";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuthStore();
  const screenWidth = Dimensions.get("window").width;

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (user) {
        setUserData(user);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Profil Kartı */}
        <View style={styles.profileCard}>
          <Image
            source={
              userData?.profile
                ? { uri: userData.profile }
                : require("../assets/images/default-user.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.username}>{userData?.username}</Text>
          <Text style={styles.role}>{userData?.role?.toUpperCase()}</Text>
        </View>

        {/* Quiz İstatistikleri */}
        <View style={styles.statsContainer}>
          <StatBox
            icon="book"
            label="Soru"
            value={userData?.quizData?.quiz_number || 0}
          />
          <StatBox
            icon="checkmark-circle"
            label="Doğru"
            value={userData?.quizData?.true_number || 0}
          />
          <StatBox
            icon="close-circle"
            label="Yanlış"
            value={userData?.quizData?.false_number || 0}
          />
        </View>

        {/* Can Alma Paneli */}
        <BuyLive />
      </ScrollView>
      <BackButton />
    </View>
  );
}

// ⬇️ Stat kutusu bileşeni
const StatBox = ({ icon, label, value }) => (
  <View style={styles.statBox}>
    <Ionicons name={icon} size={28} color={COLORS.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  profileCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    alignItems: "center",
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  role: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 18,
    marginHorizontal: 6,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginTop: 6,
  },
});
