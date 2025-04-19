import { QuizActions } from "@/types/QuizActions";
import { QuizState } from "@/types/QuizState";
import questions from '../data/questions'
import { Question } from "@/types/Question";

const STAGES = ["Start", "Playing", "End"]

export const initialState: QuizState = {
    gameStage: STAGES[0],
    questions: questions as Question[], // Forçar tipagem se necessário
    currentQuestion: 0,
    score: 0,
    answerSelected: false,
    correctAnswers: 0
}

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};
  
  const shuffleAndPickQuestions = (questions: typeof initialState.questions, count: number) => {
    return [...questions]
      .sort(() => Math.random() - 0.5) // Embaralha as perguntas
      .slice(0, count) // Seleciona as primeiras `count` perguntas
      .map((question) => ({
        ...question,
        options: shuffleArray(question.options), // Embaralha as opções de cada pergunta
      }));
  };
  

export const quizReducer = (state: QuizState, action: QuizActions): QuizState => {
    switch(action.type) {
        case 'START_QUIZ':
            return {
                ...state,
                questions: shuffleAndPickQuestions(state.questions, 10),
                gameStage: 'Playing',
                currentQuestion: 0,
                score: 0,
                answerSelected: false,
                correctAnswers: 0
            };

        case 'CHANGE_QUESTION':
            return {
                ...state,
                currentQuestion: action.payload.nextQuestion,
                gameStage: action.payload.gameStage,
                answerSelected: false
            }
        case 'CHECK_ANSWER':
            if (state.answerSelected) return state;

            const answer = action.payload.answer;
            const option = action.payload.option;

            // Define pontuação com base na dificuldade
            const difficulty = state.questions[state.currentQuestion].difficulty;
            const difficultyScore = difficulty === "Fácil" ? 2 : difficulty === "Médio" ? 3 : 5;

            // Verifica se a resposta está correta
            const isCorrect = answer === option;
            const correctAnswer = isCorrect ? difficultyScore : 0;

            return {
                ...state,
                score: state.score + correctAnswer,
                answerSelected: option, // Marca a opção selecionada
                correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0)
            };

        case 'NEW_GAME':
            return {
                ...initialState,
                questions: shuffleAndPickQuestions(initialState.questions, 10)
            }
        default:
            return state;
    }
}
