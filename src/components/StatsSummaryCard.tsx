import React from "react";
import styles from "./StatsSummaryCard.module.css";
import { Edital } from "@/types/Question";

interface StatsSummaryCardProps {
  selectedEdital: Edital | null | undefined;
  selectedSubjects: string[];
  numberOfQuestions: number;
  isLoading: boolean;
  onStart: () => void;
  onEdit: () => void;
}

export default function StatsSummaryCard({
  selectedEdital,
  selectedSubjects,
  numberOfQuestions,
  isLoading,
  onStart,
  onEdit,
}: StatsSummaryCardProps) {
  // Função para formatar a exibição dos assuntos
  const formatSubjects = (subjects: string[]) => {
    if (subjects.length === 0) return "Todos";
    if (subjects.length === 1) return subjects[0];
    if (subjects.length <= 3) return subjects.join(", ");
    
    // Para muitos assuntos, quebra em linhas
    return subjects.join(", ");
  };

  // Determina se há múltiplos assuntos
  const hasMultipleSubjects = selectedSubjects.length > 3;
  const subjectsText = formatSubjects(selectedSubjects);

  const statsData = [
    {
      label: "Edital",
      value: selectedEdital === null ? "Todos os Editais" : selectedEdital?.title || "-",
      icon: "📋",
      isExpandable: false
    },
    {
      label: "Assunto(s)",
      value: subjectsText,
      icon: "📚",
      isExpandable: hasMultipleSubjects
    },
    {
      label: "Questões",
      value: numberOfQuestions.toString(),
      icon: "📊",
      isExpandable: false
    }
  ];

  return (
    <>
      <div className={styles.description}>
        Resumo da configuração do seu simulado
      </div>
      <div className={styles.scrollContainer}>
        {statsData.map((stat, index) => (
          <div 
            key={index} 
            className={`${styles.statCard} ${stat.isExpandable ? styles.expandable : ''}`}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <div className={`${styles.statInfo} ${!stat.isExpandable ? styles.centered : ''}`}>
                  <span className={styles.statIcon}>{stat.icon}</span>
                  <div className={styles.statTextContainer}>
                    <span className={styles.statLabel}>{stat.label}</span>
                    <span 
                      className={`${styles.statValue} ${stat.isExpandable ? styles.multipleSubjects : ''}`}
                      title={stat.isExpandable ? stat.value : undefined}
                    >
                      {stat.value}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.actionButton} ${isLoading ? styles.actionButtonDisabled : ""}`}
          onClick={onStart}
          disabled={isLoading}
          type="button"
        >
          <span className={styles.buttonGradient}>
            {isLoading ? (
              <span className={styles.loadingContainer}>
                <span className={styles.loadingSpinner} />
                <span className={styles.loadingText}>Preparando...</span>
              </span>
            ) : (
              <span className={styles.buttonContent}>
                <span className={styles.actionButtonText}>Iniciar Simulado</span>
                <span className={styles.buttonIcon}>🚀</span>
              </span>
            )}
          </span>
        </button>
        <button
          className={styles.editButton}
          onClick={onEdit}
          type="button"
        >
          <span className={styles.editButtonText}>Editar Configuração</span>
        </button>
      </div>
    </>
  );
}