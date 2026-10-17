import QuizCategoryScreen from "@/components/QuizCategoryScreen";
import { useAppTheme } from "@/hooks/useAppTheme";
import { turkeyQuizData } from "../index";

export default function TurkeyQuizPage() {
  const { colors } = useAppTheme();
  return (
    <QuizCategoryScreen
      title="Türkiye quizleri"
      eyebrow="YAKINDAN TANI"
      subtitle="Şehirler, bölgeler ve ilçeler için meydan okumaya hazır mısın?"
      items={turkeyQuizData}
      returnTo="/quiz/turkey"
      accent={colors.menuTurkeyAccent}
      tint={colors.menuTurkey}
      note="Türkiye’nin dört bir yanını sorularla keşfet."
    />
  );
}
