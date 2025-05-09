"use client";

import React, { useState } from "react";
import { useQuiz } from "@/contexts/quiz";
import Subject from "../subject/Subject";
import styles from "./start.module.css";
import { fetchQuestions } from "@/services/quizService";
import LoadingModal from "../loadingModal/LoadingModal";

function Start() {
  const quizCtx = useQuiz();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);

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
      
      // Embaralha e seleciona o número de questões escolhido
      const shuffledQuestions = [...allQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfQuestions)
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
      <div className={styles.questionsSelector}>
        <label htmlFor="numberOfQuestions">Número de questões:</label>
        <select 
          id="numberOfQuestions"
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
          className={styles.select}
        >
          <option value={10}>10 questões</option>
          <option value={20}>20 questões</option>
          <option value={30}>30 questões</option>
          <option value={40}>40 questões</option>
          <option value={50}>50 questões</option>
        </select>
      </div>
      <button 
        onClick={handleStartQuiz}
        disabled={isLoading}
        className={styles.startButton}
      >
        Iniciar Simulado
      </button>
      <div className={styles.disclaimer}>
        <p>⚠️ <strong>Aviso:</strong> As questões deste simulado são geradas por Inteligência Artificial e podem conter imprecisões ou erros. Recomendamos que você consulte fontes oficiais e materiais de estudo confiáveis para confirmar as informações.</p>
      </div>
      <div className={styles.copyright}>
        <p>© 2025 almeidafabio</p>
      </div>
      <LoadingModal isOpen={isLoading} />
    </div>
  );
}

export default Start; 