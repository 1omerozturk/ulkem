import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function QuizHome() {
  const router = useRouter();
  const [profile, setProfile] = useState("");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const profileImage = `https://api.dicebear.com/7.x/avataaars/png?seed=new`;
    setProfile(profileImage);
  }, []);

  const renderGrid = ({ item }) => (
    <Animated.View style={styles.gridView}>
      <TouchableOpacity
        onPress={() => router.push(item?.url)}
        activeOpacity={0.85}
        style={styles.grid}
      >
        <Image
          tintColor={COLORS.primary}
          style={styles.gridImage}
          height={50}
          width={50}
          source={`${item.path}`}
        />
        <Image
          tintColor={COLORS.white}
          style={styles.gridImage}
          height={50}
          width={50}
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
      source={require("@/assets/images/bg.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Üst Header */}
        <View style={styles.header}>
          <Text style={styles.username}>Kullanıcı Adı</Text>
          <Image
            height={50}
            width={50}
            source={
              profile
                ? { uri: profile }
                : require("@/assets/images/default-user.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.points}>Puan: 1200</Text>
        </View>

        {/* Grid Alanı */}
        <FlatList
          data={[
            {
              title: "İl - Plaka",
              url: "quiz/plate",
              path: require("@/assets/images/icons/city.png"),
              path2: require("@/assets/images/plate.png"),
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
              title: "İl - Alan Kodu",
              url: "quiz/plate",
              path: require("@/assets/images/icons/city.png"),
              path2: require("@/assets/images/icons/phone.png"),
            },
          ]}
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
            <Ionicons name="stats-chart-outline" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={toggleSettings}>
            <Ionicons name="settings-outline" size={30} color="white" />
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
  background: { flex: 1, resizeMode: "cover" },
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
  username: { fontSize: 18, color: "white" },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  points: { fontSize: 18, color: "white" },
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
    borderWidth: 3,
    borderColor: COLORS.black,
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

  gridText: { color: COLORS.white, fontSize: 20, fontWeight: "bold" },
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
