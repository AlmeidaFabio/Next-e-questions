"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import styles from './Header.module.css';

export function Header() {
  const router = useRouter();
  const { user } = useAuth();

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleProfileClick = () => {
    if (user) {
      router.push('/user');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo/Título */}
          <div className={styles.logo}>
            <h1 className={styles.title}>
              Edital em Questão
            </h1>
          </div>

          {/* Saudação no centro */}
          <div className={styles.greeting}>
            {user ? (
              <span className={styles.greetingText}>
                Olá, {user.name}
              </span>
            ) : (
              <span className={styles.greetingText}>
                Bem-vindo
              </span>
            )}
          </div>

          {/* Menu de Navegação */}
          <nav className={styles.nav}>
            <button
              onClick={handleHomeClick}
              className={styles.navButton}
            >
              Home
            </button>
            <button
              onClick={handleProfileClick}
              className={styles.navButton}
            >
              {user ? 'Perfil' : 'Login'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}