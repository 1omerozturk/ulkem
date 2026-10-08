import { COLORS } from "@/constants/Colors";
import QuizCategoryScreen from "@/components/QuizCategoryScreen";
import { worldQuizData } from "../index";
import { WORLD_CONTINENTS } from "@/model/world/continents";

export default function WorldQuizPage() {
  return (
    <QuizCategoryScreen
      title="Dünya quizleri"
      eyebrow="SINIRLARI AŞ, KEŞFET"
      subtitle="Ülkeleri, şehirleri, başkentleri ve bayrakları kıta kıta keşfet."
      items={worldQuizData}
      returnTo="/quiz/world"
      continentOptions={WORLD_CONTINENTS}
      accent={COLORS.menuWorldAccent}
      tint={COLORS.menuWorld}
      note="Her doğru cevap dünyayı biraz daha yakından tanıtır."
    />
  );
}
