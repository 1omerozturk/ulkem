import { COLORS } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LifeTimer from "../../components/LifeTimer";
import SettingsModal from "../../components/SettingsModal";

export const worldQuizData = [
  {
    title: "Ülke - Başkent",
    url: "quiz/country-capital",
    path: require("@/assets/images/u_icons/capital.png"),
  },
  {
    title: "Ülke - Kıta",
    url: "quiz/country-continent",
    path: require("@/assets/images/u_icons/continents.png"),
  },
  {
    title: "Ülke - Bayrak",
    url: "quiz/country-flag",
    path: require("@/assets/images/u_icons/flags.png"),
  },
];

export const turkeyQuizData = [
  {
    title: "İl - Plaka",
    url: "quiz/plate",
    path: require("@/assets/images/u_icons/plate.png"),
  },
  {
    title: "İl - Bölge",
    url: "quiz/region",
    path: require("@/assets/images/u_icons/capital.png"),
  },
  {
    title: "İl - İlçe",
    url: "quiz/district",
    path: require("@/assets/images/u_icons/districts.png"),
  },
  {
    title: "İl - Plaka (20)",
    url: "quiz/plate20",
    path: require("@/assets/images/u_icons/plate.png"),
  },
];

export const data = { world: worldQuizData, turkey: turkeyQuizData };

export default function QuizHome() {
  const { logout, user, refreshLivesIfNeeded } = useAuthStore();
  const router = useRouter();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchData = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      refreshLivesIfNeeded();
      setUserData(user);
      // console.log(user);
      setRefreshing(false);
    }, 1000);
  };

  const refresh = () => {
    fetchData();
  };

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      Alert.alert("Başarılı", "Başarılı bir şekilde çıkış yapıldı.");
    }
  };

  const handleBuyLife = async () => {
    // await decrementLife();
    // console.log("1 can azaldı. ");
    router.push("life");
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const renderCategory = (categoryName, items) => (
    <View key={categoryName} style={{ marginBottom: 30 }}>
      <Text style={styles.categoryTitle}>
        {categoryName === "world" ? "🌍 Dünya" : "🇹🇷 Türkiye"}
      </Text>
      <View style={styles.categoryGrid}>
        {items.map((item, index) => (
          <Animated.View key={index} style={styles.gridView}>
            <TouchableOpacity
              onPress={() => router.push(item?.url)}
              activeOpacity={0.85}
              style={styles.grid}
            >
              <Image
                style={styles.gridImage}
                height={60}
                width={60}
                source={`${item.path}`}
              />
            </TouchableOpacity>
            <Text style={styles.gridText}>{item.title}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );

  const handleStats = () => {};

  // const toggleSettings = () => {
  //   const willBeVisible = !settingsVisible;
  //   setSettingsVisible(willBeVisible);

  // Animated.timing(fadeAnim, {
  //   toValue: willBeVisible ? 1 : 0,
  //   duration: 500,
  //   useNativeDriver: true,
  // }).start();
  // };

  const toggleSettings = () => setSettingsVisible(!settingsVisible);

  return (
    <ImageBackground
      // source={require("@/assets/images/bg.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Üst Header */}
        <View style={styles.header}>
          <View style={styles.headerSection}>
            <View style={styles.userDetailView}>
              <TouchableOpacity onPress={handleBuyLife}>
                <View style={styles.headerView}>
                  <Image
                    height={50}
                    width={50}
                    source={
                      userData?.profile
                        ? { uri: userData?.profile }
                        : require("@/assets/images/default-user.png")
                    }
                    style={styles.profileImage}
                  />
                  <Text style={styles.username}> {userData?.username}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.livesView}>
                <Ionicons style={styles.liveIcon} name="heart" size={20} />
                <Text style={styles.lives}> {userData?.lives}</Text>
                {user?.lives < 10 && (
                  <TouchableOpacity onPress={handleBuyLife}>
                    <Ionicons
                      style={styles.addIcon}
                      name="add-circle-outline"
                      size={25}
                    />
                  </TouchableOpacity>
                )}
                {user?.lives < 10 && <LifeTimer />}
              </View>
            </View>
          </View>
          <View style={styles.headerSection}>
            <View style={styles.userDetailView}>
              <Ionicons name="medal-outline" size={30} color={"orange"} />
              <Text style={styles.points}>{user?.score}</Text>
            </View>
          </View>
        </View>

        {/* Ana Kategoriler */}
        <View style={styles.mainView}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={[
              styles.mainCategoryCard,
              { backgroundColor: COLORS.primary },
            ]}
            onPress={() => router.push("quiz/world")}
          >
            <View style={styles.categoryView}>
              <Image
                height={40}
                width={40}
                source={require("@/assets/images/u_icons/world.png")}
                style={styles.categoryImage}
              />
              <Text style={styles.mainCategoryText}>Dünya</Text>
            </View>
            <Text style={styles.mainCategorySub}>Ülkeler quiz'lerine git</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            style={[
              styles.mainCategoryCard,
              { backgroundColor: COLORS.primary, marginTop: 20 },
            ]}
            onPress={() => router.push("quiz/turkey")}
          >
            <View style={styles.categoryView}>
              <Image
                height={60}
                width={50}
                source={require("@/assets/images/u_icons/tr_round.png")}
                style={styles.categoryImage}
              />
              <Text style={styles.mainCategoryText}>Türkiye</Text>
            </View>
            <Text style={styles.mainCategorySub}>Türkiye quiz'lerine git</Text>
          </TouchableOpacity>
        </View>

        {/* Alt Navigasyon */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.iconButton}
            onPress={toggleSettings}
          >
            <Ionicons name="settings" size={30} color={COLORS.black} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        <SettingsModal visible={settingsVisible} onToggle={toggleSettings} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "auto",
    backgroundColor: "transparent",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  headerSection: {
    width: "auto",
    alignItems: "center",
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: "800",
    fontStyle: "normal",
    color: COLORS.textDark,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  userDetailView: {
    flexDirection: "column",
    alignItems: "center",
  },
  livesView: {
    flexDirection: "row",
    columnGap: 3,
    alignContent: "center",
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  liveIcon: {
    color: COLORS.error,
  },
  addIcon: {
    color: COLORS.black,
    marginLeft: 5,
  },
  lives: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  points: {
    backgroundColor: COLORS.white,
    padding: 4,
    elevation: 10,
    borderRadius: 10,
    fontSize: 18,
    color: COLORS.black,
    fontWeight: "700",
    marginTop: 10,
  },
  mainView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 50,
  },
  gridContainer: { alignItems: "center", margin: 10, paddingBottom: 20 },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 15,
    marginLeft: 10,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  categoryView: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "auto",
  },
  mainCategoryCard: {
    width: "95%",
    height: "30%",
    flexDirection: "column",
    rowGap: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
    borderRadius: 14,
    borderColor: COLORS.black,
    borderWidth: 3,
    elevation: 5,
  },
  categoryImage: {
    width: 70,
    height: 70,
  },
  mainCategoryText: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.black,
  },

  mainCategorySub: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: "700",
    marginTop: 6,
  },
  gridView: {
    flex: 1,
    flexDirection: "column",
    rowGap: 10,
    padding: 5,
    paddingVertical: 20,
    marginVertical: 10,
    width: "50%",
    height: 180,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  grid: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    borderRadius: 20,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  gridImage: {
    width: 50,
    height: 50,
  },

  gridText: { color: COLORS.black, fontSize: 20, fontWeight: "bold" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  iconButton: { padding: 10 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "transparent",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: { fontSize: 20, fontWeight: "bold" },
  modalButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  modalButtonText: { color: "black", fontSize: 16 },
});
