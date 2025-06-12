import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../constants/Colors";
import BackButton from "./BackButton";

export default function BuyLive() {
  const { user, buyLife } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleBuy = async () => {
    if (user.lives >= 10) {
      Alert.alert("Can Sınırı", "Zaten maksimum 10 cana sahipsiniz.");
    } else if (user.score < 500) {
      Alert.alert(
        "Yetersiz Puan",
        "Bir can almak için en az 500 puanınız olmalı."
      );
    } else {
      await buyLife();
      Alert.alert("Başarılı", "1 can satın alındı!");
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          flexDirection: screenWidth > 600 ? "row" : "column",
        },
      ]}
    >
      <View style={styles.infoBox}>
        <Ionicons name="heart-circle" size={80} color={COLORS.primary} />
        <Text style={styles.title}>Can Satın Al</Text>
        <Text style={styles.info}>
          500 puan karşılığında 1 can alabilirsiniz
        </Text>
        <View style={styles.status}>
          <View style={styles.buttonView}>
            <Ionicons name="heart" size={30} color={COLORS.primary} />
            <Text style={styles.statusText}>{user.lives} / 10</Text>
          </View>
          <View style={styles.buttonView}>
            <Ionicons name="star" size={30} color={COLORS.score} />
            <Text style={styles.statusText}>{user.score}</Text>
          </View>
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleBuy}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Ionicons name="add-circle-outline" size={24} color={COLORS.white} />
          <Text style={styles.buttonText}>1 Can Satın Al (500 Puan)</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoBox: {
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: COLORS.cardBackground,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  status: {
    flexDirection: "column",
    rowGap: 10,
  },
  statusText: {
    fontSize: 24,
    marginBottom: 10,
    color: COLORS.textDark,
    fontWeight: "bold",
  },
  highlight: {
    color: COLORS.textPrimary,
    fontWeight: "bold",
  },

  buttonView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: 10,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
