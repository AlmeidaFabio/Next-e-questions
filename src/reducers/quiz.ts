import { QuizActions } from "@/types/QuizActions";
import { QuizState } from "@/types/QuizState";

const calculateElapsedTime = (startTime: number | null): number => {
    return startTime ? Date.now() - startTime : 0;
};

export const initialState: QuizState = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    selectedSubjects: [],
    gameStage: "Start",
    answerSelected: false,
    selectedAnswer: null,
    answers: {},
    startTime: null,
    elapsedTime: 0
};

export function quizReducer(state: QuizState, action: QuizActions): QuizState {
    switch (action.type) {
        case "SET_QUESTIONS":
            return {
                ...state,
                questions: action.payload.questions,
                answers: {}
            };
        case "START_QUIZ":
            return {
                ...state,
                selectedSubjects: action.payload.subjects,
                currentQuestionIndex: 0,
                score: 0,
                answers: {},
                startTime: Date.now(),
                elapsedTime: 0
            };
        case "ANSWER_QUESTION":
            const currentQuestion = state.questions[state.currentQuestionIndex];
            const isCorrect = currentQuestion.answer === action.payload.option;
            const newAnswers = { ...state.answers, [state.currentQuestionIndex]: action.payload.option };
            const allQuestionsAnswered = Object.keys(newAnswers).length === state.questions.length;
            
            return {
                ...state,
                score: isCorrect ? state.score + 1 : state.score,
                answerSelected: true,
                selectedAnswer: action.payload.option,
                answers: newAnswers,
                gameStage: allQuestionsAnswered ? "End" : state.gameStage,
                elapsedTime: calculateElapsedTime(state.startTime)
            };
        case "NEXT_QUESTION":
            return {
                ...state,
                currentQuestionIndex: state.currentQuestionIndex + 1,
                answerSelected: false,
                selectedAnswer: null,
                elapsedTime: calculateElapsedTime(state.startTime)
            };
        case "GO_TO_QUESTION":
            return {
                ...state,
                currentQuestionIndex: action.payload.index,
                answerSelected: false,
                selectedAnswer: state.answers[action.payload.index] || null,
                elapsedTime: calculateElapsedTime(state.startTime)
            };
        case "RESET_QUIZ":
            return {
                ...initialState,
                selectedSubjects: []
            };
        case "SET_GAME_STAGE":
            return {
                ...state,
                gameStage: action.payload.stage,
                elapsedTime: calculateElapsedTime(state.startTime)
            };
        case "CLOSE_EXPLANATION":
            return {
                ...state,
                answerSelected: false
            };
        default:
            return state;
    }
}
