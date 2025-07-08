import { QuizContext } from "@/contexts/quizContext";
import { useContext } from "react";

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) throw new Error('useQuiz must be used within a QuizProvider');
    return context;
  }; 