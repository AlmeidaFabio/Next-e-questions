"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StorageService } from '@/services/storageService';
import { UserStats } from '@/types/Storage';

import styles from './stats.module.css';

export default function StatsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    lastQuizDate: null,
    subjectsProgress: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        try {
          const userStats = await StorageService.loadUserStats(user.id);
          setStats(userStats);
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Carregando estatísticas...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <button 
              className={styles.backButton} 
              onClick={() => router.push('/user')}
              type="button"
            >
              ← Voltar
            </button>
            <h1 className={styles.title}>Estatísticas</h1>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📊</span>
              <span className={styles.statValue}>{stats.totalQuizzes}</span>
              <span className={styles.statLabel}>Simulados</span>
            </div>
            
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📝</span>
              <span className={styles.statValue}>{stats.totalQuestions}</span>
              <span className={styles.statLabel}>Questões</span>
            </div>
            
            <div className={styles.statCard}>
              <span className={styles.statIcon}>✅</span>
              <span className={styles.statValue}>{stats.averageScore}%</span>
              <span className={styles.statLabel}>Média</span>
            </div>
            
            <div className={styles.statCard}>
              <span className={styles.statIcon}>⏱️</span>
              <span className={styles.statValue}>{Math.floor(stats.totalTimeSpent / 3600000)}h</span>
              <span className={styles.statLabel}>Tempo</span>
            </div>
          </div>

          {stats.lastQuizDate && (
            <div className={styles.lastQuizSection}>
              <h3 className={styles.sectionTitle}>Último Simulado</h3>
              <p className={styles.lastQuizDate}>
                {new Date(stats.lastQuizDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}

          {Object.keys(stats.subjectsProgress).length > 0 && (
            <div className={styles.subjectsSection}>
              <h3 className={styles.sectionTitle}>Progresso por Disciplina</h3>
              {Object.entries(stats.subjectsProgress).map(([subject, progress]) => (
                <div key={subject} className={styles.subjectItem}>
                  <span className={styles.subjectName}>{subject}</span>
                  <span className={styles.subjectProgress}>
                    {progress.averageScore}% ({progress.correctAnswers}/{progress.totalQuestions})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 