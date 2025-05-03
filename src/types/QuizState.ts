import { Question } from "./Question";

export type QuizState = {
    questions: Question[];
    currentQuestionIndex: number;
    score: number;
    isQuizStarted: boolean;
    selectedSubjects: string[];
    gameStage: "Start" | "Playing" | "End";
    answerSelected: boolean;
    selectedAnswer: string | null;
    answers: Record<number, string>;
};