import { Question } from "./Question";

export type QuizActions = 
    | { type: "SET_QUESTIONS"; payload: { questions: Question[] } }
    | { type: "START_QUIZ"; payload: { subjects: string[] } }
    | { type: "ANSWER_QUESTION"; payload: { answer: string; option: string } }
    | { type: "NEXT_QUESTION" }
    | { type: "RESET_QUIZ"; payload: { questions: Question[] } }
    | { type: "SET_GAME_STAGE"; payload: { stage: "Start" | "Playing" | "End" } }
    | { type: "GO_TO_QUESTION"; payload: { index: number } }
    | { type: "CLOSE_EXPLANATION" };