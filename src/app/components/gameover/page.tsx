import React from 'react';
import styles from './gameover.module.css';
import { useQuiz } from '@/contexts/quiz';

function GameOver() {
  const quizCtx = useQuiz();

  function getEmoji(): string {
    const percentage = (quizCtx.state.correctAnswers / quizCtx.state.questions.length) * 100;

    if (percentage > 70) {
      return '😄'; // Feliz
    } else if (percentage >= 40) {
      return '😐'; // Meio feliz
    } else {
      return '😢'; // Triste
    }
  }

  return (
    <div className={styles.gameover}>
      <h2>Fim de jogo</h2>
      <p>Pontuação: {quizCtx.state.score}</p>
      <p>Você acertou {quizCtx.state.correctAnswers} de {quizCtx.state.questions.length} perguntas</p>
      <p className={styles.emoji}>{getEmoji()}</p>
      <button onClick={() => quizCtx.dispatch({ type: 'NEW_GAME' })}>Reiniciar</button>
    </div>
  );
}

export default GameOver;