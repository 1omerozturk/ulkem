import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { COLORS } from "../constants/Colors";
import styles from "../assets/styles/notice-modal.styles";

export default function NoticeModal({
  visible,
  title,
  message,
  icon = "sparkles",
  confirmLabel = "Tamam",
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Animated.View entering={FadeIn.duration(160)} style={styles.backdropTint} />
        <Animated.View entering={ZoomIn.duration(220)} style={styles.card}>
          <View style={styles.iconHalo}>
            <View style={styles.iconCircle}>
              <Ionicons name={icon} size={29} color={destructive ? COLORS.authError : COLORS.authPrimary} />
            </View>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            {!!cancelLabel && (
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
                <Text style={styles.cancelText}>{cancelLabel}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.confirmButton, destructive && styles.destructiveButton]}
              onPress={onConfirm}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
              <Ionicons name="arrow-forward" size={17} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
