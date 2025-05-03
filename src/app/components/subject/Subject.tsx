"use client";

import React, { useState, useEffect } from "react";
import { fetchQuestions } from "@/services/quizService";
import LoadingModal from "../common/LoadingModal";
import styles from "./subject.module.css";

interface SubjectProps {
  onSubjectsChange: (subjects: string[]) => void;
}

export default function Subject({ onSubjectsChange }: SubjectProps) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const questions = await fetchQuestions();
        const uniqueSubjects = Array.from(new Set(questions.map((question) => question.subject)));
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjects();
  }, []);

  const handleSubjectToggle = (subject: string) => {
    const newSelectedSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];
    
    setSelectedSubjects(newSelectedSubjects);
    onSubjectsChange(newSelectedSubjects);
  };

  const handleSelectAll = () => {
    if (selectedSubjects.length === subjects.length) {
      // Se todos já estão selecionados, deseleciona todos
      setSelectedSubjects([]);
      onSubjectsChange([]);
    } else {
      // Seleciona todos os assuntos
      setSelectedSubjects(subjects);
      onSubjectsChange(subjects);
    }
  };

  return (
    <div className={styles.subjectContainer}>
      <h2>Selecione os assuntos</h2>
      {isLoading ? (
        <LoadingModal isOpen={isLoading} />
      ) : subjects.length === 0 ? (
        <div className={styles.error}>Nenhum assunto encontrado. Verifique se as questões possuem o campo <b>subject</b> preenchido.</div>
      ) : (
        <>
          <button 
            className={styles.selectAllButton}
            onClick={handleSelectAll}
          >
            {selectedSubjects.length === subjects.length ? 'Desmarcar Todos' : 'Todos'}
          </button>
          <div className={styles.subjectsGrid}>
            {subjects.map((subject, index) => (
              <div 
                key={`${subject || 'empty'}-${index}`} 
                className={`${styles.subjectItem} ${selectedSubjects.includes(subject) ? styles.selected : ''}`}
                onClick={() => handleSubjectToggle(subject)}
              >
                <span>{subject || 'Assunto não definido'}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 