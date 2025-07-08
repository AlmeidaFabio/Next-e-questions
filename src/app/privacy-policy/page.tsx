"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import privacyPolicyText from '@/assets/privacyPolicyText';
import styles from './privacy-policy.module.css';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button onClick={() => router.back()} className={styles.backButton} type="button">
          ← Voltar
        </button>
        <h1 className={styles.title}>Política de Privacidade</h1>
        <div className={styles.content}>
          <div dangerouslySetInnerHTML={{ __html: privacyPolicyText }} />
        </div>
      </div>
    </div>
  );
} 