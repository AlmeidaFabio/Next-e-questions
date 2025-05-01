"use client";
import React from "react";
import { useQuiz } from "@/contexts/quiz";
import Start from "./components/start/page";
import Question from "./components/question/page";
import End from "./components/end/page";

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