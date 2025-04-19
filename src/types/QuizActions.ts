type StartQuizAction = {
    type: "START_QUIZ";
}

type ChangeQuestionAction = {
    type: 'CHANGE_QUESTION';
    payload: {
        nextQuestion: number;
        gameStage: string;
    }
}

type CheckAnswerAction = {
    type: 'CHECK_ANSWER'
    payload: {
        answer: string;
        option: string;
    }
}

type NewGameAction = {
    type: 'NEW_GAME'
}

export type QuizActions = StartQuizAction | ChangeQuestionAction | CheckAnswerAction | NewGameAction