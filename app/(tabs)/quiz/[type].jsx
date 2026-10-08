import QuizScreen from "../../../components/QuizScreen";
import { useLocalSearchParams } from "expo-router";

export default function QuizTypeScreen() {
  const { type, continent, returnTo } = useLocalSearchParams();
  const resolvedType = Array.isArray(type) ? type[0] : type;
  const resolvedContinent = Array.isArray(continent) ? continent[0] : continent;
  const resolvedReturnTo = Array.isArray(returnTo) ? returnTo[0] : returnTo;
  // Expo Router can reuse this dynamic route when another quiz is selected.
  // A new quiz selection must always start from its intro screen.
  return (
    <QuizScreen
      key={`${resolvedType || "quiz"}:${resolvedContinent || "all"}:${resolvedReturnTo || ""}`}
      type={resolvedType}
      continent={resolvedContinent}
      returnTo={resolvedReturnTo}
    />
  );
}
