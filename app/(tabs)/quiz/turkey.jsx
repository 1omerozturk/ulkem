import { COLORS } from "@/constants/Colors";
import QuizCategoryScreen from "@/components/QuizCategoryScreen";
import { turkeyQuizData } from "../index";

export default function TurkeyQuizPage() {
  return (
    <QuizCategoryScreen
      title="Türkiye quizleri"
      eyebrow="YAKINDAN TANI"
      subtitle="Şehirler, bölgeler ve ilçeler için meydan okumaya hazır mısın?"
      items={turkeyQuizData}
      accent={COLORS.menuTurkeyAccent}
      tint={COLORS.menuTurkey}
      note="Türkiye’nin dört bir yanını sorularla keşfet."
    />
  );
}
