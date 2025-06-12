import React, { useEffect, useState } from "react";
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

import styles from "../../assets/styles/login.styles";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { getUsers } from "../../model/db";

const SignUpScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordAgainVisible, setPasswordAgainVisible] = useState(false);
  const { isLoading, register, error, user } = useAuthStore();

  useEffect(() => {
    console.log(user);
  }, []);

  const handleSignup = async () => {
    try {
      if (username.length < 3)
        return Alert.alert("Hata", "Kullanıcı adı 3 karakterden küçük olamaz!");
      if (password !== passwordAgain)
        return Alert.alert("Hata", "Şifreler eşleşmiyor!");

      console.log(username, password);
      const result = await register(username, password);
      console.log(result);
      if (!result.success) {
        console.log("Hata", result);
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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>
            Başlamak için bir hesap oluşturunuz.
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre Doğrulama</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="key-outline"
                size={20}
                color="#8a8a8a"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi doğrulayınız"
                placeholderTextColor="#aaa"
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
                  color="#8a8a8a"
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
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>
        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten bir hesabınız var mı?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Giriş</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
