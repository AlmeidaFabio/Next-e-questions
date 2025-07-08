import React, { useState, useEffect } from "react";
import styles from "./SubjectSelector.module.css";
import questionService from "@/services/questionService";

interface SubjectSelectorProps {
  selectedSubjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
  subjects?: string[];
  onConclude?: () => void;
}

const subjectIcons: Record<string, string> = {
  Português: "📖",
  Matemática: "📐",
  Direito: "⚖️",
  História: "📜",
  Geografia: "🌍",
  Química: "🧪",
};

export default function SubjectSelector({
  selectedSubjects,
  onSubjectsChange,
  subjects: propSubjects,
  onConclude,
}: SubjectSelectorProps) {
  const [subjects, setSubjects] = useState<string[]>(propSubjects || []);
  const [isLoading, setIsLoading] = useState(!propSubjects);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (propSubjects) {
      setSubjects(propSubjects);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const loadSubjects = async () => {
        try {
          const questions = await questionService.fetchQuestions();
          const uniqueSubjects = Array.from(new Set(questions.map((question) => question.subject)));
          const sortedSubjects = uniqueSubjects.sort((a, b) => {
            const subjectA = a || "Assunto não definido";
            const subjectB = b || "Assunto não definido";
            return subjectA.localeCompare(subjectB, "pt-BR");
          });
          setSubjects(sortedSubjects);
        } catch {
          // erro silencioso
        } finally {
          setIsLoading(false);
        }
      };
      loadSubjects();
    }
  }, [propSubjects]);

  const handleSubjectToggle = (subject: string) => {
    const newSelectedSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];
    onSubjectsChange(newSelectedSubjects);
  };

  const filteredSubjects = subjects.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <span className={styles.loadingSpinner} />
        <span className={styles.loadingText}>Carregando assuntos...</span>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <span className={styles.errorIcon}>❌</span>
        <span className={styles.errorTitle}>Ops! Algo deu errado</span>
        <span className={styles.errorText}>
          Nenhum assunto encontrado. Verifique se as questões possuem o campo subject preenchido.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className={styles.description}>
        Selecione os assuntos que deseja incluir no seu simulado
      </div>
      <input
        placeholder="Buscar assunto..."
        className={styles.searchInput}
        value={search}
        onChange={e => setSearch(e.target.value)}
        type="text"
      />
      <div className={styles.scrollContainer}>
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => {
            const isSelected = selectedSubjects.includes(subject);
            const icon = subjectIcons[subject] || "📚";
            return (
              <button
                key={subject}
                className={
                  isSelected
                    ? `${styles.subjectCard} ${styles.subjectCardSelected}`
                    : styles.subjectCard
                }
                onClick={() => handleSubjectToggle(subject)}
                type="button"
              >
                <div
                  className={isSelected ? styles.selectedGradient : undefined}
                  style={isSelected ? { background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' } : {}}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <div className={styles.subjectInfo}>
                        <span className={styles.subjectIcon}>{icon}</span>
                        <span className={isSelected ? `${styles.subjectTitle} ${styles.selectedText}` : styles.subjectTitle}>
                          {subject || "Assunto não definido"}
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
          })
        ) : (
          <div className={styles.noResultsContainer}>
            <span className={styles.noResultsIcon}>🔍</span>
            <span className={styles.noResultsText}>
              Nenhum assunto encontrado para &quot;{search}&quot;
            </span>
          </div>
        )}
      </div>
      {selectedSubjects.length > 0 && onConclude && (
        <button className={styles.actionButton} onClick={onConclude} type="button">
          <span className={styles.buttonGradient}>
            <span className={styles.actionButtonText}>
              Continuar ({selectedSubjects.length} assunto{selectedSubjects.length > 1 ? "s" : ""})
            </span>
          </span>
        </button>
      )}
    </>
  );
}