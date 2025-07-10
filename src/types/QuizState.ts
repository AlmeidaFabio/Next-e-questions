import { Question, Edital } from "./Question";

export type QuizState = {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  selectedSubjects: string[];
  selectedEdital: Edital | null;
  answers: Record<number, string>;
  startTime: number | null;
  elapsedTime: number;
  selectedQuizForDetails?: unknown;
  finished?: boolean;
  id: string;
};