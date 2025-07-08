"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { StorageService } from "@/services/storageService";
import { formatTime } from "@/utils/timeUtils";
import styles from "./quiz-details.module.css";
import { SavedQuiz } from "@/types/Storage";

import { FaArrowLeft, FaEye, FaTrash } from "react-icons/fa";

export default function QuizDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<SavedQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  // Pega o id do quiz via query param (?id=...)
  const quizId = searchParams.get("id");

  useEffect(() => {
    const loadQuizDetails = async () => {
      if (user?.id && quizId) {
        try {
          const quizzes = await StorageService.loadSavedQuizzes(user.id);
          const found = quizzes.find((q) => q.id === quizId);
          if (found) {
            setQuiz(found);
          } else {
            setError("Simulado não encontrado.");
          }
        } catch {
          setError("Erro ao carregar detalhes do simulado.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setError("Simulado não encontrado.");
      }
    };
    loadQuizDetails();
  }, [user, quizId]);

  const handleDeleteQuiz = async () => {
    if (!quiz || !user?.id) return;
    if (!window.confirm("Tem certeza que deseja excluir este simulado? Esta ação não pode ser desfeita.")) return;
    try {
      const quizzes = await StorageService.loadSavedQuizzes(user.id);
      const updated = quizzes.filter((q) => q.id !== quiz.id);
      const key = `saved_quizzes_${user.id}`;
      localStorage.setItem(key, JSON.stringify(updated));
      alert("Simulado excluído com sucesso.");
      router.back();
    } catch {
      alert("Erro ao excluir simulado.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando detalhes...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || "Erro ao carregar detalhes do simulado"}</div>
        <button className={styles.backButton} onClick={() => router.back()} type="button">
          <FaArrowLeft /> Voltar
        </button>
      </div>
    );
  }

  const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
  const date = new Date(quiz.date).toLocaleDateString("pt-BR");
  const time = formatTime(quiz.timeSpent);

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.back()} type="button">
        <FaArrowLeft /> Voltar
      </button>
      <h1 className={styles.title}>Detalhes do Simulado</h1>
      <div className={styles.card}>
        <div className={styles.scoreSection}>
          <span className={styles.scoreTitle}>Pontuação</span>
          <span className={styles.scoreValue}>{quiz.score}/{quiz.totalQuestions}</span>
          <span className={styles.scoreBadge} data-status={percentage >= 70 ? "success" : percentage >= 50 ? "warning" : "error"}>
            {percentage}%
          </span>
        </div>
        <div className={styles.detailsSection}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Data</span>
            <span className={styles.detailValue}>{date}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Tempo</span>
            <span className={styles.detailValue}>{time}</span>
          </div>
          {quiz.subjects && quiz.subjects.length > 0 && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Disciplinas</span>
              <span className={styles.detailValue}>{quiz.subjects.join(", ")}</span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.actionsSection}>
        <button
          className={styles.actionButton}
          type="button"
          onClick={() => setShowAnswers((v) => !v)}
        >
          <FaEye /> {showAnswers ? 'Ocultar Respostas' : 'Ver Respostas'}
        </button>
        <button className={styles.deleteButton} type="button" onClick={handleDeleteQuiz}>
          <FaTrash /> Excluir
        </button>
      </div>
      {/* Respostas do simulado */}
      {showAnswers && (
        <div className={styles.answersSection}>
          {quiz.questions.map((question, idx) => {
            const userAnswer = quiz.answers[idx];
            return (
              <div className={styles.questionCard} key={question.id}>
                <div className={styles.questionTitle}>
                  {idx + 1}. {question.question}
                </div>
                <div className={styles.optionsList}>
                  {question.options.map(option => {
                    const isCorrect = option.text === question.answer;
                    const isUser = option.text === userAnswer;
                    const isIncorrect = isUser && !isCorrect;
                    return (
                      <div
                        key={option.id}
                        className={[
                          styles.optionItem,
                          isCorrect ? styles.correct : '',
                          isIncorrect ? styles.incorrect : '',
                          isUser ? styles.user : '',
                        ].filter(Boolean).join(' ')}
                      >
                        {option.text}
                        {isCorrect && <span style={{marginLeft: 8}}>✔</span>}
                        {isIncorrect && <span style={{marginLeft: 8}}>✗</span>}
                      </div>
                    );
                  })}
                </div>
                {question.explanation && (
                  <div className={styles.explanation}>
                    <strong>Explicação:</strong> {question.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 