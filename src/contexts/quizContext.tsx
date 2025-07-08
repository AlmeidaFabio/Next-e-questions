"use client"
import React, { createContext, Dispatch, ReactNode, useReducer, useEffect } from "react";
import { QuizState } from "@/types/QuizState";
import { QuizActions } from "@/types/QuizActions";
import { initialState, quizReducer } from "../reducers/quizReducer";
import { StorageService } from "@/services/storageService";
import { useAuth } from '../contexts/authContext';

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
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { user } = useAuth();

  // Carregar progresso salvo ao iniciar
  useEffect(() => {
    (async () => {
      if (user?.id) {
        const saved = await StorageService.loadCurrentQuiz(user.id);
        if (saved && saved.questions && saved.questions.length > 0) {
          dispatch({ type: "SET_QUESTIONS", payload: { questions: saved.questions } });
          // Restaurar outros campos se necessário
        }
      }
    })();
  }, [user]);

  // Persistência automática
  useEffect(() => {
    const handlePersistence = async () => {
      if (!user?.id) return;
      // Salvar progresso se houver questões
      if (state.questions.length > 0) {
        StorageService.saveCurrentQuiz(user.id, state);
      }
      // Limpar progresso salvo ao resetar
      if (state.questions.length === 0) {
        StorageService.clearCurrentQuiz(user.id);
      }
    };
    handlePersistence();
  }, [state, user]);

  return (
    <QuizContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </QuizContext.Provider>
  );
}