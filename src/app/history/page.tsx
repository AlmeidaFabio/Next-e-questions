"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/authContext';
import { StorageService } from '@/services/storageService';
import { SavedQuiz } from '@/types/Storage';
import { formatTime } from '@/utils/timeUtils';
import styles from './history.module.css';

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (user?.id) {
        try {
          const savedQuizzes = await StorageService.loadSavedQuizzes(user.id);
          setQuizzes(savedQuizzes);
        } catch (error) {
          console.error("Error fetching quizzes:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchQuizzes();
  }, [user]);

  const handleQuizClick = (quizId: string) => {
    router.push(`/quiz-details?id=${quizId}`);
  };

  if (isLoading) {
    return (
      <div className={styles['history-loading-container']}>
        <div className={styles['history-loader']} />
        <span className={styles['history-loading-text']}>Carregando histórico...</span>
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
        <h1 className={styles['history-title']}>Histórico</h1>
      </div>
      {quizzes.length === 0 ? (
        <div className={styles['history-empty-container']}>
          <span className={styles['history-empty-icon']}>📚</span>
          <h2 className={styles['history-empty-title']}>Nenhum simulado encontrado</h2>
          <p className={styles['history-empty-text']}>
            Complete seu primeiro simulado para ver o histórico aqui.
          </p>
        </div>
      ) : (
        <div className={styles['history-list-content']}>
          {quizzes.map((quiz) => {
            const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
            const date = new Date(quiz.date).toLocaleDateString("pt-BR");
            const time = formatTime(quiz.timeSpent);
            return (
              <button
                key={quiz.id}
                className={styles['history-quiz-item']}
                onClick={() => handleQuizClick(quiz.id)}
                type="button"
              >
                <div className={styles['history-quiz-item-gradient']}>
                  <div className={styles['history-quiz-item-header']}>
                    <span className={styles['history-quiz-date']}>{date}</span>
                    <span
                      className={styles['history-score-badge']}
                      style={{ backgroundColor: percentage >= 70 ? '#4caf50' : percentage >= 50 ? '#2196f3' : '#f44336' }}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <div className={styles['history-quiz-item-content']}>
                    <span className={styles['history-quiz-score']}>
                      {quiz.score}/{quiz.totalQuestions} acertos
                    </span>
                    <span className={styles['history-quiz-time']}>Tempo: {time}</span>
                    {quiz.subjects.length > 0 && (
                      <span className={styles['history-quiz-subjects']}>
                        Disciplinas: {quiz.subjects.join(", ")}
                      </span>
                    )}
                  </div>
                  <div className={styles['history-quiz-item-footer']}>
                    <span className={styles['history-chevron']}>›</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 