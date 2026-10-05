import React from "react";
import { ScrollView, Text, View } from "react-native";
import BackButton from "@/components/BackButton";
import BuyLive from "@/components/BuyLive";
import LifeTimer from "@/components/LifeTimer";
import styles from "@/assets/styles/life.styles";
import { GAME_RULES } from "@/constants/GameConfig";

export default function LifeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <BackButton />
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>OYUNA DEVAM ET</Text>
        <Text style={styles.title}>Canların</Text>
        <Text style={styles.subtitle}>
          Puanlarını kullanarak bir can kazanabilir, quizlere kaldığın yerden
          devam edebilirsin.
        </Text>
      </View>
      <BuyLive />
      <LifeTimer />
      <View style={styles.note}>
        <Text style={styles.noteText}>
          En fazla {GAME_RULES.maxLives} can biriktirebilirsin. Yeni bir can her {GAME_RULES.lifeRechargeMinutes} dakikada bir eklenir.
        </Text>
      </View>
    </ScrollView>
  );
}
