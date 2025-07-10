import { QuizActions } from "@/types/QuizActions";
import { QuizState } from "@/types/QuizState";

const calculateElapsedTime = (startTime: number | null): number => {
  return startTime ? Date.now() - startTime : 0;
};

const generateQuizId = (): string => {
  return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  selectedSubjects: [],
  selectedEdital: null,
  answers: {},
  startTime: null,
  elapsedTime: 0,
  finished: false,
  id: ""
};

export function quizReducer(state: QuizState, action: QuizActions): QuizState {
  switch (action.type) {
    case "SET_QUESTIONS":
      return {
        ...state,
        questions: action.payload.questions,
        answers: {},
        currentQuestionIndex: 0,
        score: 0
      };

    case "START_QUIZ":
      return {
        ...state,
        selectedEdital: action.payload.edital,
        selectedSubjects: action.payload.subjects,
        currentQuestionIndex: 0,
        score: 0,
        answers: {},
        startTime: Date.now(),
        elapsedTime: 0,
        id: generateQuizId(),
      };

    case "ANSWER_QUESTION":
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = currentQuestion.answer === action.payload.option;
      const newAnswers = { ...state.answers, [state.currentQuestionIndex]: action.payload.option };
      
      return {
        ...state,
        score: isCorrect ? state.score + 1 : state.score,
        answers: newAnswers,
        elapsedTime: calculateElapsedTime(state.startTime)
      };

    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        elapsedTime: calculateElapsedTime(state.startTime)
      };

    case "GO_TO_QUESTION":
      return {
        ...state,
        currentQuestionIndex: action.payload.index,
        elapsedTime: calculateElapsedTime(state.startTime)
      };

    case "RESET_QUIZ":
      return { ...initialState };

    case "TICK":
      return {
        ...state,
        elapsedTime: calculateElapsedTime(state.startTime)
      };

    case "FINISH_QUIZ":
      return {
        ...state,
        finished: true,
        elapsedTime: calculateElapsedTime(state.startTime)
      };

    case "RESTORE_PROGRESS":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}