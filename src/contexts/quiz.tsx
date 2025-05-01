"use client"
import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";
import { QuizState } from "@/types/QuizState";
import { QuizActions } from "@/types/QuizActions";
import { initialState, quizReducer } from "@/reducers/quiz";

type ContextType = {
    state: QuizState;
    dispatch: Dispatch<QuizActions>;
};

type ProviderType = {
    children: ReactNode;
};

export const QuizContext = createContext<ContextType>({
    state: initialState,
    dispatch: () => null,
});

export function QuizProvider({ children }: ProviderType) {
    const [ state, dispatch ] = useReducer(quizReducer, initialState);

    return (
        <QuizContext.Provider value={{
            state,
            dispatch
        }}>
            { children }
        </QuizContext.Provider>
    )
}

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if(!context) throw new Error('useQuiz must be used within a QuizProvider');
    return context;
}