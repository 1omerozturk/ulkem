import QuizScreen from "../../../components/QuizScreen";
import { useLocalSearchParams } from "expo-router";

export default function QuizTypeScreen() {
  const { type, continent } = useLocalSearchParams();
  return <QuizScreen type={type} continent={continent} />;
}
