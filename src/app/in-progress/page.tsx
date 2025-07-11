"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/authContext';
import { StorageService } from '@/services/storageService';
import { QuizState } from '@/types/QuizState';
import { formatTime } from '@/utils/timeUtils';
import styles from '../history/history.module.css';

export default function InProgressPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Partial<QuizState>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (user?.id) {
        try {
          const currentQuizzes = await StorageService.loadCurrentQuizzes(user.id);
          setQuizzes(currentQuizzes.filter(q => !q.finished));
        } catch (error) {
          console.error("Error fetching current quizzes:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchQuizzes();
  }, [user]);

  const handleQuizClick = (quizId: string) => {
    const quizExists = quizzes.some(q => q.id === quizId);
    if (!quizExists) {
      alert("Simulado não encontrado ou foi removido.");
      return;
    }
    localStorage.setItem('current_inprogress_quiz_id', quizId);
    router.push(`/question`);
  };

  if (isLoading) {
    return (
      <div className={styles['history-loading-container']}>
        <div className={styles['history-loader']} />
        <span className={styles['history-loading-text']}>Carregando simulados em andamento...</span>
      </div>
    );
  }

  return (
    <div className={styles['history-container']}>
      <div className={styles['history-header']}>
        <button
          className={styles['history-back-button']}
          onClick={() => router.back()}
          type="button"
        >
           Voltar
        </button>
        <h1 className={styles['history-title']}>Simulados em Andamento</h1>
      </div>
      {quizzes.length === 0 ? (
        <div className={styles['history-empty-container']}>
          <span className={styles['history-empty-icon']}>⏳</span>
          <h2 className={styles['history-empty-title']}>Nenhum simulado em andamento</h2>
          <p className={styles['history-empty-text']}>
            Inicie um simulado e salve para continuar depois.
          </p>
        </div>
      ) : (
        <div className={styles['history-list-content']}>
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              className={styles['history-quiz-item']}
              onClick={() => handleQuizClick(quiz.id!)}
              type="button"
            >
              <div className={styles['history-quiz-item-gradient']}>
                <div className={styles['history-quiz-item-header']}>
                  <span className={styles['history-quiz-date']}>
                    {quiz.startTime ? new Date(quiz.startTime).toLocaleDateString("pt-BR") : ""}
                  </span>
                </div>
                <div className={styles['history-quiz-item-content']}>
                  <span className={styles['history-quiz-score']}>
                    {quiz.answers ? Object.keys(quiz.answers).length : 0}/{quiz.questions ? quiz.questions.length : 0} respondidas
                  </span>
                  <span className={styles['history-quiz-time']}>
                    Tempo: {quiz.elapsedTime ? formatTime(quiz.elapsedTime) : '0:00'}
                  </span>
                  {quiz.selectedSubjects && quiz.selectedSubjects.length > 0 && (
                    <span className={styles['history-quiz-subjects']}>
                      Disciplinas: {quiz.selectedSubjects.join(", ")}
                    </span>
                  )}
                </div>
                <div className={styles['history-quiz-item-footer']}>
                  <span className={styles['history-chevron']}>›</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 