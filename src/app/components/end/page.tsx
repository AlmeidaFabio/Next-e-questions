"use client";

import React from "react";
import { useQuiz } from "@/contexts/quiz";
import styles from "./end.module.css";

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
      <h1>Simulado Finalizado!</h1>
      <div className={styles.score}>
        <p>Acertos: {quizCtx.state.score} de {quizCtx.state.questions.length}</p>
      </div>
      <button 
        className={styles.newGameButton} 
        onClick={handleNewGame}
      >
        Novo Simulado
      </button>
    </div>
  );
}

export default End; 