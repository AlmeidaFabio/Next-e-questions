"use client";

import React, { useState } from "react";
import { useQuiz } from "@/contexts/quiz";
import Subject from "../subject/Subject";
import styles from "./start.module.css";
import LoadingModal from "../LoadingModal";
import { fetchQuestions } from "@/services/quizService";

function Start() {
  const quizCtx = useQuiz();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleStartQuiz() {
    setIsLoading(true);
    try {
      let allQuestions;
      
      if (selectedSubjects.length === 0) {
        // Se nenhum subject selecionado, pega todas as questões
        allQuestions = await fetchQuestions();
      } else {
        // Se subjects selecionados, pega questões específicas
        const questionsBySubject = await Promise.all(
          selectedSubjects.map(subject => fetchQuestions(subject))
        );
        allQuestions = questionsBySubject.flat();
      }
      
      // Embaralha e seleciona 10 questões
      const shuffledQuestions = [...allQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map(question => ({
          ...question,
          // Embaralha as opções de cada questão
          options: [...question.options].sort(() => Math.random() - 0.5)
        }));

      // Atualiza o estado com as questões
      quizCtx.dispatch({ 
        type: "SET_QUESTIONS", 
        payload: { questions: shuffledQuestions } 
      });

      // Inicia o quiz
      quizCtx.dispatch({ 
        type: "START_QUIZ", 
        payload: { subjects: selectedSubjects } 
      });
      
      quizCtx.dispatch({
        type: "SET_GAME_STAGE",
        payload: { stage: "Playing" }
      });
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Erro ao carregar as questões. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.start}>
      <h1>Edital em Questão</h1>
      <p>Teste seus conhecimentos para concursos públicos com questões de diversas disciplinas</p>
      <Subject onSubjectsChange={setSelectedSubjects} />
      <button 
        onClick={handleStartQuiz}
        disabled={isLoading}
      >
        Iniciar Simulado
      </button>
      <LoadingModal isOpen={isLoading} />
    </div>
  );
}

export default Start; 