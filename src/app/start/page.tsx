"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { useQuiz } from "@/hooks/useQuiz";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import EditalSelector from "@/components/EditalSelector";
import SubjectSelector from "@/components/SubjectSelector";
import QuestionNumberSelector from "@/components/QuestionNumberSelector";
import StatsSummaryCard from "@/components/StatsSummaryCard";
import editalService from "@/services/editalService";
import questionService from "@/services/questionService";
import { Edital } from "@/types/Question";
import { StorageService } from "@/services/storageService";
import { QuizState } from "@/types/QuizState";
import { FaPlay } from "react-icons/fa";
import styles from "../page.module.css";

const QUESTION_OPTIONS = [10, 20, 30, 40, 50];

export default function StartPage() {
  const { user } = useAuth();
  const quizCtx = useQuiz();
  const router = useRouter();

  const [editais, setEditais] = useState<Edital[]>([]);
  const [selectedEdital, setSelectedEdital] = useState<Edital | null | undefined>(undefined);
  const [editalSubjects, setEditalSubjects] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingQuiz, setPendingQuiz] = useState<QuizState | null>(null);

  useEffect(() => {
    editalService.fetchAll().then(setEditais).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedEdital) {
      editalService.fetchSubjects(selectedEdital.id)
        .then(setEditalSubjects)
        .catch(() => setEditalSubjects([]));
    } else {
      setEditalSubjects([]);
    }
  }, [selectedEdital]);

  useEffect(() => {
    if (user?.id) {
      StorageService.loadCurrentQuiz(user.id).then((saved: Partial<QuizState> | null) => {
        if (saved && Array.isArray(saved.questions) && saved.questions.length > 0 && Object.keys(saved.answers || {}).length < saved.questions.length) {
          setPendingQuiz(saved as QuizState);
        } else {
          setPendingQuiz(null);
        }
      });
    }
  }, [user]);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      let allQuestions = [];
      if (!selectedEdital) {
        if (selectedSubjects.length === 0) {
          allQuestions = await questionService.fetchQuestions();
        } else {
          const questionsBySubject = await Promise.all(
            selectedSubjects.map(subject => questionService.fetchQuestions(subject))
          );
          allQuestions = questionsBySubject.flat();
        }
      } else {
        if (selectedSubjects.length === 0) {
          allQuestions = await questionService.fetchQuestionsByEdital(selectedEdital.id);
        } else {
          const questionsBySubject = await Promise.all(
            selectedSubjects.map(subject => questionService.fetchQuestionsByEditalAndSubject(selectedEdital.id, subject))
          );
          allQuestions = questionsBySubject.flat();
        }
      }
      const shuffledQuestions = [...allQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfQuestions)
        .map(question => ({
          ...question,
          options: [...question.options].sort(() => Math.random() - 0.5)
        }));
      quizCtx.dispatch({
        type: "SET_QUESTIONS",
        payload: { questions: shuffledQuestions }
      });
      quizCtx.dispatch({
        type: "START_QUIZ",
        payload: { edital: selectedEdital ?? null, subjects: selectedSubjects }
      });
      router.push("/question");
    } catch {
      alert("Erro ao carregar as questões. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueQuiz = () => {
    router.push("/question");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className={`${styles.container} pt-16`}>
          <div className={styles.backgroundGradient}>
            <div className={styles.header}>
              <p className={styles.subtitle}>
                Monte seu Simulado
              </p>
            </div>
            <div className={styles.buttonSection}>
              {step === 1 && (
                <EditalSelector
                  editais={editais}
                  selectedEdital={selectedEdital}
                  onSelectEdital={setSelectedEdital}
                  onConclude={() => setStep(2)}
                />
              )}
              
              {step === 2 && (
                <SubjectSelector
                  selectedSubjects={selectedSubjects}
                  onSubjectsChange={setSelectedSubjects}
                  subjects={selectedEdital ? editalSubjects : undefined}
                  onConclude={() => setStep(3)}
                />
              )}
              
              {step === 3 && (
                <QuestionNumberSelector
                  numberOfQuestions={numberOfQuestions}
                  setNumberOfQuestions={setNumberOfQuestions}
                  options={QUESTION_OPTIONS}
                  onConclude={() => setStep(4)}
                />
              )}
              
              {step === 4 && (
                <StatsSummaryCard
                  selectedEdital={selectedEdital}
                  selectedSubjects={selectedSubjects}
                  numberOfQuestions={numberOfQuestions}
                  isLoading={isLoading}
                  onStart={handleStartQuiz}
                  onEdit={() => setStep(1)}
                />
              )}

              {/* Botão Continuar Simulado - aparece abaixo dos passos */}
              {pendingQuiz && (
                <div className="mt-8">
                  <button className={styles.startButton} onClick={handleContinueQuiz}>
                    <div className={styles.buttonGradient}>
                      <div className={styles.buttonContent}>
                        <div className={styles.buttonTextContainer}>
                         
                          <span className={styles.startButtonSubtext}>Você tem um simulado em andamento</span>
                          <span className={styles.startButtonText}>Continuar Simulado</span>
                        </div>
                        <div className={styles.buttonIconContainer}>
                          <span className={styles.buttonIconGradient}>
                            <FaPlay size={18} className={styles.buttonIcon} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
              
              <div className={styles.motivationalSection}>
                <span className={styles.motivationalText}>
                  &quot;O sucesso é a soma de pequenos esforços repetidos dia após dia&quot;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}