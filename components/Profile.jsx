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
import Animated, { FadeInUp } from "react-native-reanimated";
import { COLORS } from "../constants/Colors";
import { useAuthStore } from "../store/authStore";
import BackButton from "./BackButton";
import BuyLive from "./BuyLive";

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
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        style={styles.container}
      >
        {/* Profil Kartı */}
        <Animated.View
          entering={FadeInUp.delay(200)}
          style={styles.profileCard}
        >
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
        </Animated.View>

        {/* Quiz İstatistikleri */}
        <View style={styles.statsContainer}>
          <StatBox
            id={1}
            icon="book"
            label="Quiz"
            value={userData?.quizData?.quiz_number || 0}
            color={COLORS.primary}
          />
          <StatBox
            id={2}
            icon="help-circle"
            label="Soru"
            value={userData?.quizData?.question_number || 0}
            color={COLORS.textPrimary}
          />
          <StatBox
            id={3}
            icon="checkmark-circle"
            label="Doğru"
            value={userData?.quizData?.true_number || 0}
            color={COLORS.true}
          />
          <StatBox
            id={4}
            icon="close-circle"
            label="Yanlış"
            value={userData?.quizData?.false_number || 0}
            color={COLORS.false}
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
const StatBox = ({ id, icon, label, value, color }) => {
  const delay = 150 * id;
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.statBox}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  profileCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    alignItems: "center",
    padding: 14,
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
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginTop: 6,
  },
});
