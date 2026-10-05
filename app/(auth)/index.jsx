import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../assets/styles/login.styles";
import Loading from "../../components/Loading";
import NoticeModal from "../../components/NoticeModal";
import { COLORS } from "../../constants/Colors";
import { BRAND } from "../../constants/GameConfig";
import { useAuthStore } from "../../store/authStore";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { isLoading, login, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      if (!response.success)
        return Alert.alert(
          "Girdiğiniz bilgiler hatalıdır. Lütfen tekrar deneyiniz.",
        );
      return (
        <NoticeModal
          message={
            username
              ? username
              : "" + "Hoşgeldiniz.\nOynamaya başlayabiliriz 🎮"
          }
        ></NoticeModal>
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollViewStyle}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.brandMark}>
            <Ionicons name="map-outline" size={34} color={COLORS.authPrimary} />
            <View style={styles.brandAccent} />
          </View>
          <Text style={styles.eyebrow}>TÜRKİYE&apos;Yİ KEŞFET</Text>
          <Text style={styles.title}>{`${BRAND.name}’ya hoş geldin`}</Text>
          <Text style={styles.subtitle}>
            Bilgini keşfet, her gün yeni bir şey öğren.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kullanıcı Adı</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.authTextMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Kullanıcı adınızı giriniz"
                  placeholderTextColor={COLORS.authPlaceholder}
                  value={username}
                  onChangeText={setUsername}
                  keyboardType="default"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color={COLORS.authTextMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Şifrenizi giriniz"
                  placeholderTextColor={COLORS.authPlaceholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.authTextMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <Loading compact message="Giriş yapılıyor" />
            ) : (
              <Text style={styles.buttonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Henüz hesabın yok mu?</Text>
          <TouchableOpacity onPress={() => router.navigate("/signup")}>
            <Text style={styles.link}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
