import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsModal({ visible, onToggle }) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity style={styles.closeButton} onPress={onToggle}>
            <Ionicons name="close-circle" size={35} color={COLORS.error} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Oyun Ayarları</Text>

          {/* Ayar Seçenekleri */}
          <Text style={styles.modalOption}>🔊 Ses: Açık</Text>
          <Text style={styles.modalOption}>🌐 Dil: Türkçe</Text>
          <Text style={styles.modalOption}>🎨 Tema: Koyu</Text>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  openButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 300,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalOption: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    position:'absolute',
    right:5,
    top:5,
    borderRadius: 6,
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});
