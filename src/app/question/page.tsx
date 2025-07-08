"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { formatTime } from "@/utils/timeUtils";
import Question from "@/components/Question";
import styles from "./page.module.css";

export default function QuestionPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();
  const [displayTime, setDisplayTime] = useState("00:00");

  // Memoized calculations
  const quizData = useMemo(() => {
    const answeredQuestions = Object.keys(state.answers).length;
    const totalQuestions = state.questions.length;
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isCurrentQuestionAnswered = !!state.answers[state.currentQuestionIndex];
    const allQuestionsAnswered = answeredQuestions === totalQuestions;
    const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    return {
      currentQuestion,
      isCurrentQuestionAnswered,
      answeredQuestions,
      totalQuestions,
      allQuestionsAnswered,
      progressPercentage,
      hasPreviousQuestion: state.currentQuestionIndex > 0,
      hasNextQuestion: state.currentQuestionIndex < totalQuestions - 1,
    };
  }, [state.questions, state.currentQuestionIndex, state.answers]);

  // Timer effect
  useEffect(() => {
    if (quizData.totalQuestions === 0 || state.finished) return;

    const timer = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    if (quizData.allQuestionsAnswered) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [quizData.totalQuestions, quizData.allQuestionsAnswered, dispatch, state.finished]);

  // Display time effect
  useEffect(() => {
    setDisplayTime(formatTime(state.elapsedTime));
  }, [state.elapsedTime]);

  // Navigation handlers
  const handleNextQuestion = useCallback(() => {
    if (quizData.hasNextQuestion) {
      dispatch({ type: "NEXT_QUESTION" });
    } else if (quizData.allQuestionsAnswered) {
      router.push("/end");
    } else {
      // Find first unanswered question
      const firstUnansweredIndex = state.questions.findIndex((_: unknown, index: number) => !state.answers[index]);
      if (firstUnansweredIndex !== -1) {
        dispatch({ type: "GO_TO_QUESTION", payload: { index: firstUnansweredIndex } });
      }
    }
  }, [quizData.hasNextQuestion, quizData.allQuestionsAnswered, state.questions, state.answers, dispatch, router]);

  const handlePreviousQuestion = useCallback(() => {
    if (quizData.hasPreviousQuestion) {
      dispatch({ type: "GO_TO_QUESTION", payload: { index: state.currentQuestionIndex - 1 } });
    }
  }, [quizData.hasPreviousQuestion, state.currentQuestionIndex, dispatch]);

  const handleSelectOption = useCallback((option: string) => {
    dispatch({
      type: "ANSWER_QUESTION",
      payload: {
        answer: quizData.currentQuestion.answer,
        option,
      },
    });
  }, [quizData.currentQuestion?.answer, dispatch]);

  const handleFinish = useCallback(() => {
    dispatch({ type: "FINISH_QUIZ" });
    router.push("/end");
  }, [router, dispatch]);

  // Loading state
  if (!quizData.currentQuestion) {
    return (
      <ProtectedRoute>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingCard}>
            <span className={styles.loadingText}>Carregando questão...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        {/* Header com progresso */}
        <div className={styles.header}>
          <div className={styles.headerGradient}>
            <div className={styles.headerContent}>
              <div className={styles.progressSection}>
                <span className={styles.progressText}>
                  {state.currentQuestionIndex + 1} de {quizData.totalQuestions}
                </span>
                <div className={styles.progressBarContainer}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: `${quizData.progressPercentage}%` }} 
                  />
                </div>
              </div>
              <div className={styles.timeSection}>
                <span className={styles.timeLabel}>Tempo</span>
                <span className={styles.timeText}>{displayTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className={styles.scrollContainer}>
          {/* Metadata Card */}
          <div className={styles.metadataCard}>
            <div className={styles.metadataRow}>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Disciplina</span>
                <span className={styles.metadataValue}>{quizData.currentQuestion.subject}</span>
              </div>
              <div className={styles.metadataDivider} />
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Tópico</span>
                <span className={styles.metadataValue}>{quizData.currentQuestion.topic}</span>
              </div>
            </div>
          </div>

          {/* Enunciado da questão */}
          <Question
            question={quizData.currentQuestion.question}
            options={quizData.currentQuestion.options}
            answer={quizData.currentQuestion.answer}
            selected={state.answers[state.currentQuestionIndex]}
            isAnswered={quizData.isCurrentQuestionAnswered}
            onSelect={handleSelectOption}
            explanation={quizData.currentQuestion.explanation}
          />

          {/* Navegação entre questões */}
          <div className={styles.navigationButtons}>
            <button
              className={styles.navButton}
              onClick={handlePreviousQuestion}
              disabled={!quizData.hasPreviousQuestion}
              type="button"
            >
              Anterior
            </button>
            
            {quizData.hasNextQuestion && (
              <button
                className={styles.navButton}
                onClick={handleNextQuestion}
                disabled={!quizData.isCurrentQuestionAnswered}
                type="button"
              >
                Próxima
              </button>
            )}
            
            {quizData.allQuestionsAnswered && (
              <button
                className={styles.finishButton}
                onClick={handleFinish}
                type="button"
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}