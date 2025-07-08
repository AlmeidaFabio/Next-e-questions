"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StorageService } from '@/services/storageService';
import styles from './user.module.css';
import { Header } from '@/components/Header';

export default function UserPage() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    totalTimeSpent: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        const userStats = await StorageService.loadUserStats(user.id);
        setStats({
          totalQuizzes: userStats.totalQuizzes || 0,
          averageScore: userStats.averageScore || 0,
          totalTimeSpent: userStats.totalTimeSpent || 0,
        });
      }
    };
    fetchStats();
  }, [user]);

  const menuItems = [
    {
      id: 'history',
      title: 'Histórico',
      subtitle: 'Visualize seus simulados anteriores',
      icon: '📚',
      color: '#6366f1',
      onPress: () => router.push('/history'),
    },
    {
      id: 'stats',
      title: 'Estatísticas',
      subtitle: 'Acompanhe seu progresso',
      icon: '📊',
      color: '#10b981',
      onPress: () => router.push('/stats'),
    },
    {
      id: 'settings',
      title: 'Configurações',
      subtitle: 'Preferências e gerenciamento',
      icon: '⚙️',
      color: '#f59e0b',
      onPress: () => router.push('/settings'),
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className={styles.backgroundGradient}>
        <Header />
        <div className={styles.container}>
          <div className={styles.content}>
            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.title}>Meu Perfil</h1>
              <p className={styles.subtitle}>
                Gerencie seus dados e acompanhe seu progresso
              </p>
            </div>

            {/* Menu Items */}
            <div className={styles.menuContainer}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={styles.menuItem}
                  onClick={item.onPress}
                  type="button"
                >
                  <div className={styles.menuItemGradient}>
                    <div className={styles.iconContainer} style={{ backgroundColor: item.color }}>
                      <span className={styles.icon}>{item.icon}</span>
                    </div>
                    <div className={styles.menuItemContent}>
                      <h3 className={styles.menuItemTitle}>{item.title}</h3>
                      <p className={styles.menuItemSubtitle}>{item.subtitle}</p>
                    </div>
                    <span className={styles.chevron}>›</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className={styles.quickStatsContainer}>
              <h2 className={styles.quickStatsTitle}>Resumo Rápido</h2>
              <div className={styles.quickStatsGrid}>
                <div className={styles.quickStatItem}>
                  <span className={styles.quickStatNumber}>{stats.totalQuizzes}</span>
                  <span className={styles.quickStatLabel}>Simulados</span>
                </div>
                <div className={styles.quickStatItem}>
                  <span className={styles.quickStatNumber}>{stats.averageScore}%</span>
                  <span className={styles.quickStatLabel}>Média</span>
                </div>
                <div className={styles.quickStatItem}>
                  <span className={styles.quickStatNumber}>{Math.floor(stats.totalTimeSpent / 3600000)}h</span>
                  <span className={styles.quickStatLabel}>Tempo</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              type="button"
            >
              <div className={styles.logoutGradient}>
                <span className={styles.logoutIcon}>🚪</span>
                <span className={styles.logoutText}>Sair da Conta</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 