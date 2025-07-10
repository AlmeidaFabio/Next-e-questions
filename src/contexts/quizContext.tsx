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

  // Carregar progresso salvo ao iniciar (restaura o último simulado em andamento, se houver)
  useEffect(() => {
    (async () => {
      if (user?.id) {
        const quizzes = await StorageService.loadCurrentQuizzes(user.id);
        let quizToRestore = quizzes[0];
        if (typeof window !== 'undefined') {
          const selectedId = localStorage.getItem('current_inprogress_quiz_id');
          if (selectedId) {
            const found = quizzes.find(q => q.id === selectedId);
            if (found) quizToRestore = found;
            // Limpa o id após restaurar
            localStorage.removeItem('current_inprogress_quiz_id');
          }
        }
        if (quizToRestore && quizToRestore.questions && quizToRestore.questions.length > 0) {
          dispatch({ type: "RESTORE_PROGRESS", payload: quizToRestore });
        }
      }
    })();
  }, [user]);

  // Persistência automática
  useEffect(() => {
    const handlePersistence = async () => {
      if (!user?.id) return;
      // Salvar progresso se houver questões e id
      if (state.questions.length > 0 && state.id) {
        StorageService.saveCurrentQuiz(user.id, state);
      }
      // Remover do array se resetar
      if (state.questions.length === 0 && state.id) {
        StorageService.removeCurrentQuiz(user.id, state.id);
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