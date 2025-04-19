import { Question } from "./Question";

export type QuizState = {
    gameStage: string;
    questions: Question[];
    currentQuestion: number;
    score: number;
    answerSelected: boolean | string;
    correctAnswers: number;
};