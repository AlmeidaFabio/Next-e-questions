"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import termsOfServiceText from '@/assets/termsOfServiceText';
import styles from './terms-of-service.module.css';

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button onClick={() => router.back()} className={styles.backButton} type="button">
          ← Voltar
        </button>
        <h1 className={styles.title}>Termos de Uso</h1>
        <div className={styles.content}>
          <div dangerouslySetInnerHTML={{ __html: termsOfServiceText }} />
        </div>
      </div>
    </div>
  );
}

