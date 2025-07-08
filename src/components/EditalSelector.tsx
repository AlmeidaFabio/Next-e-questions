import React from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import styles from "./EditalSelector.module.css";
import { Edital } from "@/types/Question";

interface EditalSelectorProps {
  editais: Edital[];
  selectedEdital: Edital | null | undefined;
  onSelectEdital: (edital: Edital | null) => void;
  onConclude: () => void;
}

export default function EditalSelector({ editais, selectedEdital, onSelectEdital, onConclude }: EditalSelectorProps) {
  const editalOptions = [
    { id: null, title: 'Todos os Editais', description: 'Questões de todos os editais disponíveis' }, 
    ...editais
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.subtitle}>
          Escolha um edital específico ou selecione &quot;Todos os Editais&quot; para um simulado abrangente
        </p>
      </div>
      
      <div className={styles.scrollContainer}>
        {editalOptions.map((edital) => {
          const isSelected = (selectedEdital === null && edital.id === null) || (selectedEdital?.id === edital.id);
          return (
            <button
              key={edital.id === null ? 'all' : edital.id}
              className={`${styles.editalCard} ${isSelected ? styles.editalCardSelected : ''}`}
              onClick={() => onSelectEdital(edital.id === null ? null : edital)}
              type="button"
            >
              <div className={styles.cardGradient}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.editalTitle}>
                      {edital.title}
                    </span>
                    {isSelected && (
                      <div className={styles.checkContainer}>
                        <FaCheck size={14} className={styles.checkIcon} />
                      </div>
                    )}
                  </div>
                  {edital.description && (
                    <span className={styles.editalDescription}>
                      {edital.description}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedEdital !== undefined && (
        <button className={styles.actionButton} onClick={onConclude} type="button">
          <div className={styles.buttonGradient}>
            <div className={styles.buttonContent}>
              <div className={styles.buttonTextContainer}>
                <span className={styles.actionButtonText}>Continuar</span>
                <span className={styles.actionButtonSubtext}>Próximo passo</span>
              </div>
              <div className={styles.buttonIconContainer}>
                <span className={styles.buttonIconGradient}>
                  <FaArrowRight size={18} className={styles.buttonIcon} />
                </span>
              </div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}