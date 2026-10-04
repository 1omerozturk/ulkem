import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";

import { COLORS } from "../../constants/Colors";
import styles from "../../assets/styles/signup.styles";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";
import Loading from "../../components/Loading";

const SignUpScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordAgainVisible, setPasswordAgainVisible] = useState(false);
  const { isLoading, register, error } = useAuthStore();


  const handleSignup = async () => {
    try {
      if (username.length < 3)
        return Alert.alert("Hata", "Kullanıcı adı 3 karakterden küçük olamaz!");
      if (password !== passwordAgain)
        return Alert.alert("Hata", "Şifreler eşleşmiyor!");

      const result = await register(username, password);
      if (!result.success) {
        return Alert.alert("Hata", result.error);
      } else {
        Alert.alert(
          "Başarılı",
          "Başarılı bir şekilde kayıt oldunuz. Giriş yapabilirsiniz."
        );
        router.back();
      }
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
          <Text style={styles.title}>Aramıza katıl</Text>
          <Text style={styles.subtitle}>
            Hesabını oluştur, bilgi yolculuğuna hemen başla.
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre Doğrulama</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="key-outline"
                size={20}
                color={COLORS.authTextMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi doğrulayınız"
                placeholderTextColor={COLORS.authPlaceholder}
                value={passwordAgain}
                onChangeText={setPasswordAgain}
                secureTextEntry={!passwordAgainVisible}
              />
              <TouchableOpacity
                onPress={() => setPasswordAgainVisible(!passwordAgainVisible)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={
                    passwordAgainVisible ? "eye-outline" : "eye-off-outline"
                  }
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
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <Loading compact message="Hesap oluşturuluyor" />
            ) : (
              <Text style={styles.buttonText}>Hesap Oluştur</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten bir hesabınız var mı?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
