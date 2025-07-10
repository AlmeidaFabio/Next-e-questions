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

        <h1 className={styles.siteTitle}>Edital em Questão</h1>
        <div className={styles.heroImageContainer}>
          <img
            src="/images/hero.png"
            alt="Hero - plataforma de estudos"
            className={styles.heroImage}
          />
        </div>

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
        </div>
      </div>
    </div>
  );
} 