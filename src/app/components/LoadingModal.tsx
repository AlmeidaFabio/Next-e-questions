import React from 'react';
import styles from './LoadingModal.module.css';

interface LoadingModalProps {
  isOpen: boolean;
}

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.loadingSpinner} />
        <p>Carregando...</p>
      </div>
    </div>
  );
} 