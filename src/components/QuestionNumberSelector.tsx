import React from "react";
import styles from "./QuestionNumberSelector.module.css";

interface QuestionNumberSelectorProps {
  numberOfQuestions: number;
  setNumberOfQuestions: (n: number) => void;
  options: number[];
  disabled?: boolean;
  onConclude: () => void;
}

export default function QuestionNumberSelector({
  numberOfQuestions,
  setNumberOfQuestions,
  options,
  disabled,
  onConclude,
}: QuestionNumberSelectorProps) {
  return (
    <>
      <div className={styles.description}>
        Escolha quantas questões deseja responder
      </div>
      <div className={styles.scrollContainer}>
        {options.map((option) => {
          const isSelected = numberOfQuestions === option;
          return (
            <button
              key={option}
              className={
                isSelected
                  ? `${styles.optionCard} ${styles.optionCardSelected}`
                  : styles.optionCard
              }
              onClick={() => setNumberOfQuestions(option)}
              type="button"
            >
              <div
                className={isSelected ? styles.selectedGradient : undefined}
                style={isSelected ? { background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' } : {}}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.optionInfo}>
                      <span className={styles.optionIcon}>📊</span>
                      <span className={isSelected ? `${styles.optionTitle} ${styles.selectedText}` : styles.optionTitle}>
                        {option} questões
                      </span>
                    </div>
                    {isSelected ? (
                      <span className={styles.checkContainer}>
                        <span className={styles.checkIcon}>✓</span>
                      </span>
                    ) : (
                      <span className={styles.iconPlaceholder} />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <button
        className={`${styles.actionButton} ${disabled ? styles.actionButtonDisabled : ""}`}
        onClick={onConclude}
        disabled={disabled}
        type="button"
      >
        <span className={styles.buttonGradient}>
          <span className={styles.actionButtonText}>Finalizar Configuração</span>
        </span>
      </button>
    </>
  );
}