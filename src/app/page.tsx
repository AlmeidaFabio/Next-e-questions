"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "../components/ThemeToggle";
import styles from "./page.module.css";
import { FaArrowRight } from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleStart = () => {
    router.push("/start");
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.backgroundGradient}>
        {/* Botão de alternância de tema */}
        <ThemeToggle />

        {/* Título principal */}
        <h1 className={styles.siteTitle}>
          Edital em Questão
        </h1>

        {/* Imagem hero */}
        <div className={styles.heroImageContainer}>
          <img
            src="/images/hero.png"
            alt="Edital em Questão - Plataforma de estudos para concursos públicos"
            className={styles.heroImage}
          />
        </div>

        {/* Seção do cabeçalho */}
        <div className={styles.header}>
          <p className={styles.subtitle}>
            Sua plataforma de estudos para concursos públicos
          </p>
        </div>

        {/* Seção dos botões */}
        <div className={styles.buttonSection}>
          <button 
            className={styles.startButton} 
            onClick={handleStart}
            aria-label="Iniciar estudos na plataforma"
          >
            <div className={styles.buttonGradient}>
              <div className={styles.buttonContent}>
                <div className={styles.buttonTextContainer}>
                  <span className={styles.startButtonText}>
                    Começar Estudos
                  </span>
                  <span className={styles.startButtonSubtext}>
                    Vamos à aprovação!
                  </span>
                </div>
                <div className={styles.buttonIconContainer}>
                  <span className={styles.buttonIconGradient}>
                    <FaArrowRight 
                      size={22} 
                      className={styles.buttonIcon}
                      aria-hidden="true"
                    />
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