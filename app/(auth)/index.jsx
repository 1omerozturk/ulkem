import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import styles from "../../assets/styles/login.styles";
import { router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { deleteUsers } from "../../model/db";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { isLoading, login, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      console.log(response);
      if (!response.success)
        return Alert.alert(
          "Girdiğiniz bilgiler hatalıdır. Lütfen tekrar deneyiniz."
        );
      return Alert.alert(
        "Giriş Başarılı",
        `Hoşgeldiniz, ${response?.user?.username}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Giriş</Text>
          <Text style={styles.subtitle}>
            Hoşgeldiniz! Hesabınıza giriş yapınız.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kullanıcı Adı</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#8a8a8a"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı adınızı giriniz"
                placeholderTextColor="#aaa"
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
                color="#8a8a8a"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi giriniz"
                placeholderTextColor="#aaa"
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
                  color="#8a8a8a"
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
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabım yok?</Text>
          <TouchableOpacity onPress={() => router.navigate("/signup")}>
            <Text style={styles.link}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
