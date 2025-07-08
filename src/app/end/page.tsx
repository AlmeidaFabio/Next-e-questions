"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/hooks/useQuiz';
import { useAuth } from '@/contexts/authContext';
import { StorageService } from '@/services/storageService';
import { formatTime } from '@/utils/timeUtils';
import styles from './end.module.css';

export default function EndPage() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const { user } = useAuth();
  
  // Calculate quiz statistics
  const totalQuestions = state.questions.length;
  const correctAnswers = state.score;
  const wrongAnswers = totalQuestions - correctAnswers;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Get performance level and message
  const getPerformanceData = () => {
    if (percentage >= 90) return { level: 'Excelente', emoji: '🎉', color: '#4caf50', message: 'Parabéns! Performance excepcional!' };
    if (percentage >= 70) return { level: 'Muito Bom', emoji: '👏', color: '#2196f3', message: 'Ótimo trabalho! Continue assim!' };
    if (percentage >= 50) return { level: 'Bom', emoji: '👍', color: '#ff9800', message: 'Bom resultado! Pode melhorar ainda mais!' };
    return { level: 'Precisa Melhorar', emoji: '💪', color: '#f44336', message: 'Não desista! A prática faz a perfeição!' };
  };

  const performanceData = getPerformanceData();

  // Save quiz effect
  useEffect(() => {
    if (
      state.finished &&
      state.questions.length > 0 &&
      Object.keys(state.answers).length === state.questions.length
    ) {
      const saveQuiz = async () => {
        if (!user?.id) return;
        try {
          await StorageService.saveQuiz(user.id, state);
        } catch (error) {
          console.error('Error saving quiz:', error);
        }
      };
      saveQuiz();
    }
  }, [state.finished, state.questions.length, state.answers, state, user]);

  async function handleNewGame() {
    dispatch({ type: 'RESET_QUIZ', payload: { questions: [] } });
    if (user?.id) {
      await StorageService.clearCurrentQuiz(user.id);
    }
    router.push('/start');
  }

  function handleViewHistory() {
    router.push('/history');
  }

  function handleViewStats() {
    router.push('/stats');
  }

  const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header Section */}
        <div className={styles.header}>
          <span className={styles.emoji}>{performanceData.emoji}</span>
          <h1 className={styles.title}>Simulado Finalizado!</h1>
          <div className={styles.performanceBadge} style={{ backgroundColor: performanceData.color }}>
            <span className={styles.performanceText}>{performanceData.level}</span>
          </div>
          <p className={styles.performanceMessage}>{performanceData.message}</p>
        </div>

        {/* Score Circle */}
        <div className={styles.scoreCircle} style={{ borderColor: performanceData.color }}>
          <div className={styles.scoreContent}>
            <span className={styles.scorePercentage}>{percentage}%</span>
            <span className={styles.scoreText}>de acerto</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <StatCard label="Questões" value={totalQuestions} icon="📝" />
          <StatCard label="Acertos" value={correctAnswers} icon="✅" />
          <StatCard label="Erros" value={wrongAnswers} icon="❌" />
          <StatCard label="Tempo" value={formatTime(state.elapsedTime)} icon="⏱️" />
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.primaryButton} onClick={handleNewGame} type="button">
            Novo Simulado
          </button>
          <button className={styles.secondaryButton} onClick={handleViewStats} type="button">
            Ver Estatísticas
          </button>
          <button className={styles.secondaryButton} onClick={handleViewHistory} type="button">
            Histórico
          </button>
        </div>
      </div>
    </div>
  );
}