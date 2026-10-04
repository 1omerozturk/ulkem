import QuizScreen from "../../../components/QuizScreen";
import { useLocalSearchParams } from "expo-router";

export default function QuizTypeScreen() {
  const { type } = useLocalSearchParams();
  return <QuizScreen type={type} />;
}
