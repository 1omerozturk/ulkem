import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import Profile from "@/components/Profile";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import NoticeModal from "@/components/NoticeModal";

export default function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Profile />
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setConfirmVisible(true)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Hesaptan çıkış yap"
      >
        <Ionicons name="log-out-outline" size={18} color="#A34A4A" />
        <Text style={styles.logoutText}>Çıkış yap</Text>
      </TouchableOpacity>
      <NoticeModal
        visible={confirmVisible}
        title="Yolculuktan çıkalım mı?"
        message="Hesabından çıkış yapacaksın. Dilediğinde tekrar giriş yapabilirsin."
        icon="log-out-outline"
        confirmLabel="Çıkış yap"
        cancelLabel="Oyunda kal"
        destructive
        onCancel={() => setConfirmVisible(false)}
        onConfirm={logout}
      />
    </View>
  );
}
