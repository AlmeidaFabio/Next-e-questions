"use client";
import React from "react";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";
import { FaArrowRight } from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/start");
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGradient}>

        <div className={styles.header}>
          <p className={styles.subtitle}>
            Sua plataforma de estudos para concursos públicos
          </p>
        </div>
        <div className={styles.buttonSection}>
          <button className={styles.startButton} onClick={handleStart}>
            <div className={styles.buttonGradient}>
              <div className={styles.buttonContent}>
                <div className={styles.buttonTextContainer}>
                  <span className={styles.startButtonText}>Começar Estudos</span>
                  <span className={styles.startButtonSubtext}>Vamos à aprovação!</span>
                </div>
                <div className={styles.buttonIconContainer}>
                  <span className={styles.buttonIconGradient}>
                    <FaArrowRight size={22} className={styles.buttonIcon} />
                  </span>
                </div>
              </div>
            </div>
          </button>
          <div className={styles.motivationalSection}>
            <span className={styles.motivationalText}>
              &quot;O sucesso é a soma de pequenos esforços repetidos dia após dia&quot;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 