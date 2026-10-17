import QuizCategoryScreen from "@/components/QuizCategoryScreen";
import { worldQuizData } from "../index";
import { WORLD_CONTINENTS } from "@/model/world/continents";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function WorldQuizPage() {
  const { colors } = useAppTheme();
  return (
    <QuizCategoryScreen
      title="Dünya quizleri"
      eyebrow="SINIRLARI AŞ, KEŞFET"
      subtitle="Ülkeleri, şehirleri, başkentleri ve bayrakları kıta kıta keşfet."
      items={worldQuizData}
      returnTo="/quiz/world"
      continentOptions={WORLD_CONTINENTS}
      accent={colors.menuWorldAccent}
      tint={colors.menuWorld}
      note="Her doğru cevap dünyayı biraz daha yakından tanıtır."
    />
  );
}
