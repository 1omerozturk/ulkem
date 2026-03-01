import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "@/constants/Colors";

const LifeTimer = () => {
  const { getRemainingTimeForNextLife } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState(getRemainingTimeForNextLife());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRemainingTimeForNextLife());
    }, 1000); // Her saniye güncelleme

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{getRemainingTimeForNextLife()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding:2,
    borderColor:COLORS.black,
    borderWidth:1,
    borderRadius:5,
    elevation:5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft:4,
    },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4757",
  },
});

export default LifeTimer;
