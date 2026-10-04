import { COLORS } from "@/constants/Colors";
import QuizCategoryScreen from "@/components/QuizCategoryScreen";
import { worldQuizData } from "../index";

export default function WorldQuizPage() {
  return (
    <QuizCategoryScreen
      title="Dünya quizleri"
      eyebrow="SINIRLARI AŞ, KEŞFET"
      subtitle="Ülkeler, başkentler ve bayraklar hakkındaki bilgini dene."
      items={worldQuizData}
      accent={COLORS.menuWorldAccent}
      tint={COLORS.menuWorld}
      note="Her doğru cevap dünyayı biraz daha yakından tanıtır."
    />
  );
}
