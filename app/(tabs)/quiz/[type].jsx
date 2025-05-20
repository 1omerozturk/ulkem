import { View, Text } from "react-native";
import React from "react";
import QuizScreen from "../../../components/QuizScreen";
import { useLocalSearchParams } from "expo-router";

export default function quiz() {
  const { type } = useLocalSearchParams();
  return <QuizScreen type={type} />;
}
