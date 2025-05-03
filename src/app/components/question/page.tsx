"use client";

import React, { useState, useEffect } from "react";
import { useQuiz } from "@/contexts/quiz";
import Option from "../common/Option";
import LoadingModal from "../common/LoadingModal";
import styles from "./question.module.css";

function Question() {
  const quizCtx = useQuiz();
  const [isLoading, setIsLoading] = useState(!quizCtx.state.questions.length || !quizCtx.state.questions[quizCtx.state.currentQuestionIndex]);
  const [displayTime, setDisplayTime] = useState("00:00");
  
  useEffect(() => {
    if (quizCtx.state.gameStage === "Playing") {
      const timer = setInterval(() => {
        const elapsed = quizCtx.state.startTime ? Date.now() - quizCtx.state.startTime : 0;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizCtx.state.gameStage, quizCtx.state.startTime]);

  // Verifica se temos perguntas carregadas e uma questão atual válida
  if (!quizCtx.state.questions.length || !quizCtx.state.questions[quizCtx.state.currentQuestionIndex]) {
    return <LoadingModal isOpen={isLoading} />;
  }

  const currentQuestion = quizCtx.state.questions[quizCtx.state.currentQuestionIndex];
  const isCurrentQuestionAnswered = !!quizCtx.state.answers[quizCtx.state.currentQuestionIndex];
  const hasPreviousQuestion = quizCtx.state.currentQuestionIndex > 0;
  const hasNextQuestion = quizCtx.state.currentQuestionIndex < quizCtx.state.questions.length - 1;
  const answeredQuestions = Object.keys(quizCtx.state.answers).length;
  const totalQuestions = quizCtx.state.questions.length;

  function HandleNextQuestion() {
    const nextQuestion = quizCtx.state.currentQuestionIndex + 1;

    // Se não houver próxima pergunta e todas as questões foram respondidas, finaliza o simulado
    if (!quizCtx.state.questions[nextQuestion] && answeredQuestions === totalQuestions) {
      quizCtx.dispatch({
        type: "SET_GAME_STAGE",
        payload: { stage: "End" }
      });
      return;
    }

    // Se houver próxima pergunta, avança para ela
    if (quizCtx.state.questions[nextQuestion]) {
      quizCtx.dispatch({
        type: "NEXT_QUESTION"
      });
    } else {
      // Se não houver próxima pergunta, encontra a primeira questão não respondida
      const firstUnansweredIndex = quizCtx.state.questions.findIndex((_, index) => !quizCtx.state.answers[index]);
      
      if (firstUnansweredIndex !== -1) {
        quizCtx.dispatch({
          type: "GO_TO_QUESTION",
          payload: { index: firstUnansweredIndex }
        });
      }
    }
  }

  function HandlePreviousQuestion() {
    if (quizCtx.state.currentQuestionIndex > 0) {
      quizCtx.dispatch({
        type: "GO_TO_QUESTION",
        payload: { index: quizCtx.state.currentQuestionIndex - 1 }
      });
    }
  }

  function HandleSelectOption(option: string): void {
    quizCtx.dispatch({
      type: "ANSWER_QUESTION",
      payload: {
        answer: currentQuestion.answer,
        option,
      },
    });
  }

  return (
    <div className={styles.question}>
      <div className={styles.metadata}>
        <p><strong>Tópico:</strong> {currentQuestion.topic}</p>
        <p><strong>Disciplina:</strong> {currentQuestion.subject}</p>
      </div>
      <div className={styles.score}>
        <p>
          Pergunta {quizCtx.state.currentQuestionIndex + 1} de {totalQuestions}
        </p>
        <p>Acertos: {quizCtx.state.score}</p>
        <p>Tempo: {displayTime}</p>
      </div>

      <h2>{currentQuestion.question}</h2>

      <div>
        {currentQuestion.options.map((option, index) => (
          <Option
            option={option.text}
            answer={currentQuestion.answer}
            key={`${currentQuestion.id}-${option.id}`}
            selectOption={() => HandleSelectOption(option.text)}
            letter={String.fromCharCode(65 + index)}
            isAnswered={isCurrentQuestionAnswered}
          />
        ))}
      </div>

      <div className={styles.navigation}>
        {hasPreviousQuestion && (
          <button 
            onClick={HandlePreviousQuestion}
            className={styles.navButton}
          >
            ← Anterior
          </button>
        )}
        {hasNextQuestion && (
          <button 
            onClick={HandleNextQuestion}
            className={styles.navButton}
          >
            Próxima →
          </button>
        )}
      </div>

      <p className={styles.infoText}>
        Respondidas: {answeredQuestions} de {totalQuestions} questões. O simulado só será finalizado quando todas as questões forem respondidas.
      </p>

      {quizCtx.state.answerSelected && (
        <div className={styles.explanation}>
          <div>
            <p><strong>Explicação:</strong> {currentQuestion.explanation}</p>
            <button onClick={HandleNextQuestion}>Continuar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Question;
