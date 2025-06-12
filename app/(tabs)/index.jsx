import { COLORS } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import LifeTimer from "../../components/LifeTimer";

export const data = [
  {
    title: "İl - Plaka",
    url: "quiz/plate",
    path: require("@/assets/images/icons/city.png"),
    path2: require("@/assets/images/icons/plate.png"),
  },
  {
    title: "İl - Bölge",
    url: "quiz/region",
    path: require("@/assets/images/icons/city.png"),
    path2: require("@/assets/images/icons/country.png"),
  },
  {
    title: "İl - İlçe",
    url: "quiz/district",
    path: require("@/assets/images/icons/city.png"),
    path2: require("@/assets/images/icons/district.png"),
  },
  {
    title: "İl - Plaka (20)",
    url: "quiz/plate20",
    path: require("@/assets/images/icons/city.png"),
    path2: require("@/assets/images/icons/plate.png"),
  },
];

export default function QuizHome() {
  const { logout, user, refreshLivesIfNeeded, decrementLife } = useAuthStore();
  const router = useRouter();
  const [gridData, setGridData] = useState(data);
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
      setGridData(data); // Replace with API response if needed
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

  const renderGrid = ({ item }) => (
    <Animated.View style={styles.gridView}>
      <TouchableOpacity
        onPress={() => router.push(item?.url)}
        activeOpacity={0.85}
        style={styles.grid}
      >
        <Image
          tintColor={COLORS.textDark}
          style={styles.gridImage}
          height={60}
          width={60}
          source={`${item.path}`}
        />
        <Image
          tintColor={COLORS.textDark}
          style={styles.gridImage}
          height={60}
          width={60}
          source={`${item.path2}`}
        />
      </TouchableOpacity>
      <Text style={styles.gridText}>{item.title}</Text>
    </Animated.View>
  );

  const toggleSettings = () => {
    setSettingsVisible(!settingsVisible);
    Animated.timing(fadeAnim, {
      toValue: settingsVisible ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

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
              </View>
              {user?.lives < 10 && <LifeTimer />}
            </View>
          </View>
          <View style={styles.headerSection}>
            <View style={styles.userDetailView}>
              <Ionicons name="medal-outline" size={30} color={"orange"} />
              <Text style={styles.points}>{user?.score}</Text>
            </View>
          </View>
        </View>

        {/* Grid Alanı */}
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          data={gridData}
          renderItem={renderGrid}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.gridContainer}
        />

        {/* Alt Navigasyon */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.iconButton}
            onPress={() => console.log("İstatistikler Açıldı")}
          >
            <Ionicons
              name="stats-chart-outline"
              size={30}
              color={COLORS.black}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        {/* Ayarlar Modal */}
        {/* <Modal visible={settingsVisible} animationType="fade">
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <Text style={styles.modalText}>Ayarlar Menüsü</Text>
              <TouchableOpacity
                onPress={toggleSettings}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Kapat</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal> */}
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
    alignSelf: "baseline",
    backgroundColor: "transparent",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  headerSection: {
    width: 100,
    alignItems: "center",
  },
  username: { fontSize: 18, color: COLORS.black },
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
  gridContainer: { alignItems: "center", margin: 10, marginVertical: "auto" },
  gridView: {
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
    backgroundColor: "transparent",
    borderColor: COLORS.border,
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
