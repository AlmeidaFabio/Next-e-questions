"use client";
import React from "react";
import { useQuiz } from "@/contexts/quiz";
import Welcome from "./components/welcome/page";
import Question from "./components/question/page";
import GameOver from "./components/gameover/page";
import styles from "./page.module.css";

function App() {
  const quizCtx = useQuiz();

  return (
    <div className={styles.App}>
      {quizCtx.state.gameStage === "Start" && <Welcome />}
      {quizCtx.state.gameStage === "Playing" && <Question />}
      {quizCtx.state.gameStage === "End" && <GameOver />}
    </div>
  );
}

export default App;