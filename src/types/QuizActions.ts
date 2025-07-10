import { Question, Edital } from "./Question";

export type QuizActions = 
  | { type: "SET_QUESTIONS"; payload: { questions: Question[] } }
  | { type: "START_QUIZ"; payload: { edital: Edital | null; subjects: string[] } }
  | { type: "ANSWER_QUESTION"; payload: { answer: string; option: string } }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET_QUIZ"; payload: { questions: Question[] } }
  | { type: "GO_TO_QUESTION"; payload: { index: number } }
  | { type: "CLOSE_EXPLANATION" }
  | { type: "TICK" }
  | { type: "VIEW_QUIZ_DETAILS"; payload: { quiz: unknown } }
  | { type: "FINISH_QUIZ" }
  | { type: "RESTORE_PROGRESS"; payload: Partial<import("./QuizState").QuizState> }; 