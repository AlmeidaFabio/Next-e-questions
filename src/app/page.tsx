"use client";
import React from "react";
import { useQuiz } from "@/contexts/quiz";
import Start from "./components/start/Start";
import Question from "./components/question/Question";
import End from "./components/end/End";

import styles from "./page.module.css";


function App() {
  const quizCtx = useQuiz();

  return (
    <div className={styles.App}>
      {quizCtx.state.gameStage === "Start" && <Start />}
      {quizCtx.state.gameStage === "Playing" && <Question />}
      {quizCtx.state.gameStage === "End" && <End />}
    </div>
  );
}
export default App;
