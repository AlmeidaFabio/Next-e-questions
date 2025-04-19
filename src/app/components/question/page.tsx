"use client";

import React from "react";
import { useQuiz } from "@/contexts/quiz";
import styles from "./question.module.css";
import Option from "../option/page";

function Question() {
  const quizCtx = useQuiz();
  const currentQuestion = quizCtx.state.questions[quizCtx.state.currentQuestion];

  function HandleNextQuestion() {
    const nextQuestion = quizCtx.state.currentQuestion + 1;
    let endgame = false;
    if (!quizCtx.state.questions[nextQuestion]) {
      endgame = true;
    }

    quizCtx.dispatch({
      type: "CHANGE_QUESTION",
      payload: {
        nextQuestion,
        gameStage: endgame ? "End" : quizCtx.state.gameStage,
      },
    });
  }

  function HandleSelectOption(option: string): void {
    quizCtx.dispatch({
      type: "CHECK_ANSWER",
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
          Pergunta {quizCtx.state.currentQuestion + 1} de {quizCtx.state.questions.length}
        </p>
        <p>Pontos: {quizCtx.state.score}</p>
      </div>
      <div className={styles.metadata}>
        <p><strong>Categoria:</strong> {currentQuestion.category}</p>
        <p><strong>Dificuldade:</strong> {currentQuestion.difficulty}</p>
      </div>
      <h2>{currentQuestion.question}</h2>

      <div>
        {currentQuestion.options.map((option) => (
          <Option
            option={option}
            answer={currentQuestion.answer}
            key={option}
            selectOption={() => HandleSelectOption(option)}
          />
        ))}
      </div>

      {quizCtx.state.answerSelected && (
        <button onClick={HandleNextQuestion}>Continuar</button>
      )}
    </div>
  );
}

export default Question;
