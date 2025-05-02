"use client";

import React, { useState } from "react";
import { useQuiz } from "@/contexts/quiz";
import styles from "./question.module.css";
import Option from "../common/Option";
import LoadingModal from "../LoadingModal";

function Question() {
  const quizCtx = useQuiz();
  const [isLoading, setIsLoading] = useState(!quizCtx.state.questions.length || !quizCtx.state.questions[quizCtx.state.currentQuestionIndex]);
  
  // Verifica se temos perguntas carregadas e uma questão atual válida
  if (!quizCtx.state.questions.length || !quizCtx.state.questions[quizCtx.state.currentQuestionIndex]) {
    return <LoadingModal isOpen={isLoading} />;
  }

  const currentQuestion = quizCtx.state.questions[quizCtx.state.currentQuestionIndex];

  function HandleNextQuestion() {
    const nextQuestion = quizCtx.state.currentQuestionIndex + 1;
    let endgame = false;
    if (!quizCtx.state.questions[nextQuestion]) {
      endgame = true;
    }

    quizCtx.dispatch({
      type: "NEXT_QUESTION"
    });

    if (endgame) {
      quizCtx.dispatch({
        type: "SET_GAME_STAGE",
        payload: { stage: "End" }
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
      <div className={styles.score}>
        <p>
          Pergunta {quizCtx.state.currentQuestionIndex + 1} de {quizCtx.state.questions.length}
        </p>
        <p>Acertos: {quizCtx.state.score}</p>
      </div>
      <div className={styles.metadata}>
        <p><strong>Tópico:</strong> {currentQuestion.topic}</p>
        <p><strong>Disciplina:</strong> {currentQuestion.subject}</p>
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
          />
        ))}
      </div>

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
