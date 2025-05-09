import { Question } from "./Question";

export type QuizState = {
    questions: Question[];
    currentQuestionIndex: number;
    score: number;
    selectedSubjects: string[];
    gameStage: "Start" | "Playing" | "End";
    answerSelected: boolean;
    selectedAnswer: string | null;
    answers: Record<number, string>;
    startTime: number | null;
    elapsedTime: number;
};