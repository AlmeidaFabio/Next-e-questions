import { QuizActions } from "@/types/QuizActions";
import { QuizState } from "@/types/QuizState";

export const initialState: QuizState = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    isQuizStarted: false,
    selectedSubjects: [],
    gameStage: "Start",
    answerSelected: false,
    selectedAnswer: null
};


export function quizReducer(state: QuizState, action: QuizActions): QuizState {
    switch (action.type) {
        case "SET_QUESTIONS":
            return {
                ...state,
                questions: action.payload.questions
            };
        case "START_QUIZ":
            return {
                ...state,
                isQuizStarted: true,
                selectedSubjects: action.payload.subjects,
                currentQuestionIndex: 0,
                score: 0
            };
        case "ANSWER_QUESTION":
            const currentQuestion = state.questions[state.currentQuestionIndex];
            const isCorrect = currentQuestion.answer === action.payload.option;
            return {
                ...state,
                score: isCorrect ? state.score + 1 : state.score,
                answerSelected: true,
                selectedAnswer: action.payload.option
            };
        case "NEXT_QUESTION":
            return {
                ...state,
                currentQuestionIndex: state.currentQuestionIndex + 1,
                answerSelected: false,
                selectedAnswer: null
            };
        case "RESET_QUIZ":
            return {
                ...initialState,
                questions: action.payload?.questions || state.questions,
                selectedSubjects: []
            };
        case "SET_GAME_STAGE":
            return {
                ...state,
                gameStage: action.payload.stage
            };
        default:
            return state;
    }
}
