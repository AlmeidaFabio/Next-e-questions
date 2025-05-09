"use client";

import React from "react";
import { useQuiz } from "@/contexts/quiz";
import styles from "./end.module.css";

const formatTime = (elapsed: number): string => {
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

function End() {
  const quizCtx = useQuiz();

  function handleNewGame() {
    quizCtx.dispatch({ 
      type: "RESET_QUIZ", 
      payload: { questions: [] } 
    });
  }

  return (
    <div className={styles.end}>
      <div className={styles.container}>
        <h1 className={styles.title}>Simulado Finalizado!</h1>
        <div className={styles.score}>
          <p>Acertos: {quizCtx.state.score} de {quizCtx.state.questions.length}</p>
          <p>Tempo total: {formatTime(quizCtx.state.elapsedTime)}</p>
        </div>
        <button 
          className={`button ${styles.button}`}
          onClick={handleNewGame}
        >
          Novo Simulado
        </button>
      </div>
    </div>
  );
}

export default End; 